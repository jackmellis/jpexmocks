module.exports = function(){
  var allPurposeLog = function(){
    var str = Array.from(arguments).join(' ');
    $log.messages.push(str);
  };

  var $log = function(){
    return $log.log.apply($log, arguments);
  };
  $log.log = allPurposeLog;
  $log.info = allPurposeLog;
  $log.warn = allPurposeLog;
  $log.error = allPurposeLog;
  $log.messages = [];
  return $log;
};
