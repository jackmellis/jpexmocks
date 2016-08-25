module.exports = function($promise){
  var promises = [];

  var createWhenableFunction = function(){
    var mockFn = function(){
      var args = Array.from(arguments);
      var promise = $promise(function(resolve){
        resolve(findWhenable(args, mockFn.paths));
      });
      promises.push(promise);
      mockFn.promises.push(promise);
      return promise;
    };
    mockFn.paths = [];
    mockFn.promises = [];
    mockFn.when = function(){
      var args = Array.from(arguments);
      var result = args.pop();
      var fn = (typeof result === 'function') ? result : () => result;
      
      args.fn = fn;
      mockFn.paths.push(args);
    };
    return mockFn;
  };
  
  var findWhenable = function(args, paths){
    paths = paths
      .slice()
      .reverse()
      .filter(p => p.fn && p.filter((arg, i) => areEqual(arg, args[i])).length === p.length);
    
    if (!paths.length){
      throw new Error('Unexpected request: ' + args.toString());
    }
    var fn = paths[0].fn;
    return fn;
  };
  var areEqual = function(a, b){
    if (a == b){
      return true;
    }
    if (a instanceof RegExp && typeof b === 'string'){
      return a.test(b);
    }
    if (a && b && typeof a === 'object' && typeof b === 'object'){
      var keys = Object.keys(a)
        .concat(Object.keys(b))
        .filter((a, i, r) => r.indexOf(a) === i); // Deduplicate
      
      return keys.filter(k => areEqual(a[k], b[k])).length == keys.length;
    }
    return false;
  };
  
  var $fs = {};
  $fs.access = createWhenableFunction();
  $fs.appendFile = createWhenableFunction();
  $fs.chmod = createWhenableFunction();
  $fs.chown = createWhenableFunction();
  $fs.close = createWhenableFunction();
  $fs.exists = createWhenableFunction();
  
  // readStream
  
  
  $fs.flush = function(){
    promises.forEach(p => p.flush());
  };
  
  return $fs;
};