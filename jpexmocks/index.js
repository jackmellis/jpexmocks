var mockables = require('./mockables');
var extend = require('./extend');
var internal = require('jpex/internal');

module.exports = function(Base){
  if (!Base){
    Base = require('jpex');
  }
  
  // Only do this if the class hasn't already inherited from a mocked-out class
  if (!Base._mock){
    extend(Base);
    
    // Extend extend!
    Base._mock.extend = Base.extend;
    Base.extend = function(arg){
      var opt, constructor, dependencies, invokeParent;
    
      switch(typeof arg){
        case 'function':
          opt = {};
          constructor = arg;
          dependencies = internal.extractParameters(constructor);
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
            dependencies = internal.extractParameters(constructor);
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
      
      var mockConstructor = function(){
        var args = Array.from(arguments);
        var result;
        var deps, params, newArgs;
      
        if (NewClass.mock && NewClass.mock.instances){
          NewClass.mock.instances.push(this);
        }
        if (NewClass.mock && typeof NewClass.mock.beforeInvoke === 'function'){
          // Grab dependencies required by the beforeInvoke function
          deps = internal.extractParameters(NewClass.mock.beforeInvoke);
          params = NewClass.NamedParameters(args);
          newArgs = internal.resolveDependencies(NewClass, {dependencies : deps}, params);
        
          // Invoke the function
          newArgs = NewClass.mock.beforeInvoke.apply(this, newArgs);
          
          if (newArgs){
            args = internal.resolveDependencies(NewClass, {dependencies : NewClass.Dependencies}, newArgs);
          }
        }
        
        if (constructor){
          result = constructor.apply(this, args);
        }
        
        if (NewClass.mock && typeof NewClass.mock.afterInvoke === 'function'){
          // Grab dependencies required by the afterInvoke function
          deps = internal.extractParameters(NewClass.mock.afterInvoke);
          params = NewClass.NamedParameters(args);
          newArgs = internal.resolveDependencies(NewClass, {dependencies : deps}, params);
          
          NewClass.mock.afterInvoke.apply(this, newArgs);
        }
        
        return result;
      };
      
      opt.constructor = mockConstructor;
      opt.dependencies = dependencies;
      opt.invokeParent = invokeParent;
    
      var NewClass = Base._mock.extend.call(this, opt);
      extend(NewClass);
      
      this.mock.children.push(NewClass);
      return NewClass;
    };
  }
  
  // Mock out default dependencies
  Base.mock.set('$timeout', mockables.$timeout, true);
  Base.mock.set('$interval', mockables.$timeout, true);
  Base.mock.set('$immediate', mockables.$timeout, true);
  Base.mock.set('$tick', mockables.$timeout, true);
  Base.mock.set('$log', mockables.$log, true);
  Base.mock.set('$promise', mockables.$promise, true);
  
  return Base.mock;
};