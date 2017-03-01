module.exports = function () {
  var id = 0;
  function $interval(callback, delay) {
    $interval.queue.push({
      id : ++id,
      callback : callback,
      delay : (delay || 0) + $interval.elapsed
    });
    return id;
  }
  $interval.clear = function (id) {
    var i = $interval.queue.map(function (t) {
      return t.id;
    }).indexOf(id);
    if (i > -1){
      $interval.queue.splice(i, 1);
    }
  };
  $interval.flush = function (delay) {
    if (typeof delay !== 'number'){
      // Flush all requests
      $interval.queue
        .forEach(function (t) {
          t.callback();
        });
      $interval.elapsed = 0;
    }else{
      // Flush any requests that have elapsed
      $interval.elapsed += delay;
      $interval.queue
        .forEach(function (t) {
          if ($interval.elapsed >= t.delay){
            t.callback();
          }
        });
    }
  };
  $interval.count = function () {
    return $interval.queue.length;
  };
  $interval.queue = [];
  $interval.elapsed = 0;
  return $interval;
};
