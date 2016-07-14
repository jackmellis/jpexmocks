module.exports = function(){
  var $log = function(){
    return $log.log.apply($log, arguments);
  };
  $log.log = function(){};
  $log.warn = function(){};
  $log.error = function(){};
  return $log;
};