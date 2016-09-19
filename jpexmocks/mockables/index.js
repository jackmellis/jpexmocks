module.exports = function(Base){
  var $timeout = require('./timeout');
  var $log = require('./log');
  var $promise = require('./promise');
  var $fs = require('./fs');
  
  Base.mock.set('$timeout', $timeout).interface('$itimeout');
  Base.mock.set('$interval', $timeout).interface('$iinterval');
  Base.mock.set('$immediate', $timeout).interface('$iimediate');
  Base.mock.set('$tick', $timeout).interface('$itick');
  Base.mock.set('$log', $log).interface('$ilog');
  Base.mock.set('$promise', $promise).interface('$ipromise');
  Base.mock.set('$fs', $fs).interface('$ifs');
};