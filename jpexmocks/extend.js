var internal = require('jpex/internal');

module.exports = function(Base){
    Base._mock = {};
    Base._mock.factories = {};
    
    Base.mock = {
      // Get a single dependency
      get : function(name){
      var obj = {
        dependencies : name
      };
      var result = internal.resolveDependencies(Base, obj);
      
      if (!Array.isArray(name)){
        result = result[0];
      }
      return result;
      },
    
      // Set a single dependency
      set : function(name, value){
        var type = (typeof value === 'function') ? 'Factory' : 'Constant';

        if (!Base._mock.factories[name]){
          Base._mock.factories[name] = Base._factories[name] || true;
        }

        Base.Register[type].apply(Base, arguments);
      },
      
      // Revert a single dependency
      unset : function(name){
        if (!Base._mock.factories[name] || Base._mock.factories[name] === true){
          delete Base._factories[name];
        }else{
          Base._factories[name] = Base._mock.factories[name];
        }
        delete Base._mock.factories[name];
      },
      
      // Revert the default mocked dependencies
      unsetDefaults : function(){
        ['$log', '$timeout', '$interval', '$immediate', '$tick', '$promise', '$fs']
        .forEach(Base.mock.unset);
      },
      
      // Inject a series of dependencies
      inject : function(fn){
        var self = this;
        var dependencies = internal.extractParameters(fn);
        var args = this.get(dependencies);

        var result = fn.apply(this, args);

        if (typeof result === 'object'){
          Object.keys(result).forEach(function(n){
            self.set(n, result[n]);
          });
        }
      },
      
      // Remove all mock properties from the class
      reset : function(deep){
        // Replace all mocked dependencies
        Object.keys(Base._mock.factories).forEach(function(f){
          Base.mock.unset(f);
        });

        // Replace the extend function
        Base.extend = Base._mock.extend;

        // Unmock children
        if (deep){
          Base.mock.children.forEach(function(c){
            if (c.mock && c.mock.reset){
              c.mock.reset(deep);
            }
          });
        }

        // Remove the mock object
        delete Base._mock;
        delete Base.mock;
      },
      
      // Children
      children : [],
      
      // Instances
      instances : [],
      
      // Invoke wrappers
      beforeInvoke : function(fn){
        Base._mock.beforeInvoke = fn;
      },
      afterInvoke : function(fn){
        Base._mock.afterInvoke = fn;
      }
    };
  
  Object.defineProperties(Base.mock, 
  {
    descendants : {
      get : function(){
        var direct = Base.mock.children;
        var indirect = direct.map(m => m.mock.descendants);
        return Array.prototype.concat.apply(direct, indirect).filter((m, i, arr) => arr.indexOf(m) === i);
      }
    }
  });
};