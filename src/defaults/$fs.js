var asyncFns = [
  'access', 'appendFile', 'chmod', 'chown', 'close', 'exists',
  'fchmod', 'fchown', 'fdatasync', 'fstat', 'fsync', 'ftruncate', 'futimes',
  'lchmod', 'lchown', 'link', 'lstat',
  'mkdir', 'mkdtmp',
  'open', 'read', 'readdir', 'readFile', 'readlink', 'realpath', 'rename', 'rmdir',
  'stat', 'symlink', 'truncate', 'unlink', 'utimes', 'write', 'writeFile'
];

module.exports = function ($promise, mockfs) {
  var promises = [];
  var fs;

  function track(fn) {
    var p = $promise(fn);
    promises.push(p);
    return p;
  }
  function wrapAsync(name) {
    name += 'Sync';
    return function () {
      var args = Array.prototype.slice.call(arguments);
      return track(function (resolve) {
        var result = fs[name].apply(fs, args);
        resolve(result);
      });
    };
  }

  var $fs = {
    use : function (obj) {
      fs = mockfs.fs(obj);
    },
    flush : function () {
      promises.forEach(function (p) {
        p.flush();
      });
    }
  };

  $fs.use({});
  
  Object.keys(fs).forEach(function (name) {
    if (typeof fs[name] !== 'function'){
      return;
    }
    Object.defineProperty($fs, name, {
      get : function () {
        return asyncFns.indexOf(name) > -1 ? wrapAsync(name) : fs[name];
      }
    });
  });

  return $fs;
};
module.exports.dependencies = ['$promise', 'mock-fs'];
