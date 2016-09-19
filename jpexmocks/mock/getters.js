var resolver = require('jpex/lib/resolver');

module.exports = function(Base){
  // Get a single dependency
  Base.mock.get = function(name){
    var obj = {
      dependencies : name
    };
    var result = resolver.resolveDependencies(Base, obj);

    if (!Array.isArray(name)){
      result = result[0];
    }
    return result;
  };
  
  // Set a single dependency
  Base.mock.set = function(name, value){
    var type = (typeof value === 'function') ? 'Factory' : 'Constant';

    if (!Base._mock.factories[name]){
      Base._mock.factories[name] = Base._factories[name] || true;
    }

    return Base.Register[type].apply(Base, arguments).lifecycle.application();
  };
  
  // Inject a series of dependencies
  Base.mock.inject = function(fn){
    var self = this;
    var dependencies = resolver.extractParameters(fn);
    var args = this.get(dependencies);

    var result = fn.apply(this, args);

    if (typeof result === 'object'){
      Object.keys(result).forEach(function(n){
        self.set(n, result[n]);
      });
    }
  };
  
  // Revert a single dependency
  Base.mock.unset = function(name){
    if (!Base._mock.factories[name] || Base._mock.factories[name] === true){
      delete Base._factories[name];
    }else{
      Base._factories[name] = Base._mock.factories[name];
    }
    delete Base._mock.factories[name];
  };
  
  // Revert the default mocked dependencies
  Base.mock.unsetDefaults = function(){
    ['$log', '$timeout', '$interval', '$immediate', '$tick', '$promise', '$fs']
    .forEach(Base.mock.unset);
  };
};