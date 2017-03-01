module.exports = function () {
  var log = function () {
    var str = Array.prototype.slice.call(arguments).join(' ');
    $log.messages.push(str);
  };

  var $log = function () {
    return log.apply(null, arguments);
  };
  $log.log = log;
  $log.info = log;
  $log.warn = log;
  $log.error = log;
  $log.messages = [];

  return $log;
};
