module.exports = function () {
  var id = 0;
  function $immediate(callback) {
    $immediate.queue.push({
      id : ++id,
      callback : callback
    });
    return id;
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
