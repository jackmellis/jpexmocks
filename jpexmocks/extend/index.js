var mocker = require('../mock');
var resolver = require('jpex/lib/resolver');
var Constructor = require('./constructor');

// This fake version of extend will do some extra mocking magic before calling the original extend function
module.exports = function(Base){
  return function(arg){
    var config, opt, constructor, dependencies, invokeParent;

    // Build some options up
    switch(typeof arg){
      case 'function':
        opt = {};
        constructor = arg;
        dependencies = resolver.extractParameters(constructor);
        invokeParent = false;
        break;
      case 'object':
        opt = arg;
        constructor = arg.constructor;
        dependencies = arg.dependencies;
        if (constructor && constructor === Object){
          constructor = null;
        }
        if (constructor && !dependencies){
          dependencies = resolver.extractParameters(constructor);
        }
        invokeParent = arg.invokeParent;
        if (invokeParent === undefined && !constructor){
          invokeParent = true;
        }
        break;
      default:
        opt = {};
        invokeParent = true;
        break;
    }

    // Wrap the constructor function with extra stuff
    config = {};
    config.constructor = constructor;
    var mockConstructor = Constructor(config);

    // Add remaining jpex options
    opt.constructor = mockConstructor;
    opt.dependencies = dependencies;
    opt.invokeParent = invokeParent;

    // Create the new class using the original extend method
    var NewClass = Base._mock.extend.call(Base, opt);
    config.Class = NewClass;

    // Create the mock and _mock objects
    mocker(NewClass);
    NewClass._mock.extend = Base._mock.extend;
    NewClass.extend = module.exports(NewClass);

    Base.mock.children.push(NewClass);

    return NewClass;
  };
};