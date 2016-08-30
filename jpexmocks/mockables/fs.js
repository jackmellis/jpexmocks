module.exports = function($promise){
  var promises = [];
  var MockFs = require('mock-fs');
  var fs = MockFs.fs({});
  
  var track = function(fn){
    var p = $promise(fn);
    promises.push(p);
    return p;
  };
  var wrapAsync = function(n){
    n = n + 'Sync';
    return function(){
      var args = Array.from(arguments);
      return track(function(resolve){
        var result = fs[n].apply(fs, args);
        resolve(result);
      });
    };
  };
  
  var $fs = {
    use : function(obj){
      fs = MockFs.fs(obj);
    },
    flush : function(){
      promises.forEach(p => p.flush());
    }
  };
  
  [
    'access',
    'appendFile',
    'chmod',
    'chown',
    'close',
    'exists',
    'fchmod',
    'fchown',
    'fdatasync',
    'fstat',
    'fsync',
    'ftruncate',
    'futimes',
    'lchmod',
    'lchown',
    'link',
    'lstat',
    'mkdir',
    'mkdtmp',
    'open',
    'read',
    'readdir',
    'readFile',
    'readlink',
    'realpath',
    'rename',
    'rmdir',
    'stat',
    'symlink',
    'truncate',
    'unlink',
    'utimes',
    'write',
    'writeFile'
  ]
  .forEach(function(n){
    $fs[n] = wrapAsync(n);
  });
  
  [
    'createReadStream',
    'createWriteStream',
    'unwatchFile',
    'watch',
    'watchFile'
  ]
  .forEach(function(n){
    $fs[n] = fs[n].bind(fs);
  });
  
  return $fs;
};