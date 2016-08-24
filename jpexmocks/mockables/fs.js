module.exports = function($promise){
  var promises = [];
  var p = function(fn){
    var promise = $promise(fn);
    promises.push(promise);
    return promise;
  };
  
  var $fs = {};
  $fs.access = function(path){
    return p(function(rs){
      var fn = $fs.access.paths[path];
      if (!fn){
        throw new Error('Unexpected access request:', path);
      }
      var result = fn();
      return rs(result);
    });
  };
  $fs.access.paths = {};
  $fs.access.when = function(path, result){
    var fn = (typeof result === 'function') ? result : () => result;
    $fs.access.paths[path] = fn;
  };
  
  $fs.flush = function(){
    promises.forEach(p => p.flush());
  };
};