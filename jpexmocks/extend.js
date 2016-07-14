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
          if (Base._mock.factories[f] === true){
            delete Base._factories[f];
          }else{
            Base._factories[f] = Base._mock.factories[f];
          }
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
      beforeInvoke : null,
      afterInfoke : null
    };
};