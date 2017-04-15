module.exports = function ($promise) {
  var id = 0;
  function $immediate(callback) {
    var resolve, thisId = ++id, promise;

    if (typeof callback !== 'function'){
      callback = function () {
        resolve && resolve(thisId);
        promise.flush();
      };
      promise = $promise(function (r) {
        resolve = r;
      });
      promise.flush();
    }

    $immediate.queue.push({
      id : thisId,
      callback : callback
    });
    return promise ? promise : thisId;
  }
  $immediate.clear = function (id) {
    var i = $immediate.queue.map(function (t) {
      return t.id;
    }).indexOf(id);
    if (i > -1){
      $immediate.queue.splice(i, 1);
    }
  };
  $immediate.flush = function () {
    $immediate.queue.splice(0)
      .forEach(function (t) {
        t.callback();
      });
  };
  $immediate.count = function () {
    return $immediate.queue.length;
  };
  $immediate.queue = [];
  return $immediate;
};
module.exports.dependencies = ['$promise'];
