var resolver = require('jpex/lib/resolver');

module.exports = function(config){
  return function(){
    var args = Array.from(arguments);
    var result;
    var deps, params, newArgs;

    if (config.Class.mock && config.Class.mock.instances){
      config.Class.mock.instances.push(this);
    }

    // Invoke Before
    if (config.Class._mock && typeof config.Class._mock.beforeInvoke === 'function'){
      // Grab dependencies required by the beforeInvoke function
      deps = resolver.extractParameters(config.Class._mock.beforeInvoke);
      params = config.Class.NamedParameters(args);
      newArgs = resolver.resolveDependencies(config.Class, {dependencies : deps}, params);

      // Invoke the function
      newArgs = config.Class._mock.beforeInvoke.apply(this, newArgs);

      if (newArgs){
        args = resolver.resolveDependencies(config.Class, {dependencies : config.Class.Dependencies}, newArgs);
      }
    }

    // Invoke the constructor function
    if (config.constructor){
      result = config.constructor.apply(this, args);
    }

    // Invoke After
    if (config.Class._mock && typeof config.Class._mock.afterInvoke === 'function'){
      // Grab dependencies required by the afterInvoke function
      deps = resolver.extractParameters(config.Class._mock.afterInvoke);
      params = config.Class.NamedParameters(args);
      newArgs = resolver.resolveDependencies(config.Class, {dependencies : deps}, params);

      config.Class._mock.afterInvoke.apply(this, newArgs);
    }

    return result;
  };
};