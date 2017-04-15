module.exports = function ($promise) {
  var id = 0;
  function $timeout(callback, delay) {
    var resolve, thisId = ++id, promise;

    if (typeof callback !== 'function'){
      delay = callback;
      callback = function () {
        resolve && resolve(thisId);
        promise.flush();
      };
      promise = $promise(function (r) {
        resolve = r;
      });
      promise.flush();
    }

    $timeout.queue.push({
      id : thisId,
      callback : callback,
      delay : (delay || 0) + $timeout.elapsed
    });
    return promise ? promise : thisId;
  }
  $timeout.clear = function (id) {
    var i = $timeout.queue.map(function (t) {
      return t.id;
    }).indexOf(id);
    if (i > -1){
      $timeout.queue.splice(i, 1);
    }
  };
  $timeout.flush = function (delay) {
    if (typeof delay !== 'number'){
      // Flush all requests
      $timeout.queue.splice(0)
        .forEach(function (t) {
          t.callback();
        });
      $timeout.elapsed = 0;
    }else{
      // Flush any requests that have elapsed
      $timeout.elapsed += delay;
      $timeout.queue = $timeout.queue
        .filter(function (t) {
          if ($timeout.elapsed >= t.delay){
            t.callback();
            return false;
          }else{
            return true;
          }
        });
    }
  };
  $timeout.count = function () {
    return $timeout.queue.length;
  };
  $timeout.queue = [];
  $timeout.elapsed = 0;
  return $timeout;
};
module.exports.dependencies = ['$promise'];
