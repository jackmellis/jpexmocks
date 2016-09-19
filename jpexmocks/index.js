var mockables = require('./mockables');
var mocker = require('./mock');
var extend = require('./extend');

module.exports = function(Base){
  if (!Base){
    Base = require('jpex');
  }
  
  // Only do this if the class hasn't already inherited from a mocked-out class
  if (!Base._mock){
    mocker(Base);
    
    // Extend extend!
    Base._mock.extend = Base.extend;
    Base.extend = extend(Base);
  }
  
  // Mock out default dependencies
  mockables(Base);
  
  return Base.mock;
};