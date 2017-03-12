var stubObject = require('./stubObject');

module.exports = function(Class, name){
  var decorators = (Class.$$factories[name] || {}).decorators;
  var hasDecorator = decorators && decorators.length && decorators.find(function (fn) {
    return fn.$$stubber;
  });
  if (!hasDecorator){
    decorators = (Class.$$mock.factories[name] || Class.$$factories[name] || {}).decorators = (decorators || []).concat(function (result) {
      var shouldStub = true;
      var autoStub = Class.$autoStub;
      if (autoStub){
        if (autoStub.include && autoStub.include.indexOf(name) < 0){
          shouldStub = false;
        }else if (autoStub.exclude && autoStub.exclude.indexOf(name) > -1){
          shouldStub = false;
        }
      }else{
        shouldStub = false;
      }

      return shouldStub ? stubObject.call(Class, result) : result;
    });
    decorators[decorators.length-1].$$stubber = true;
  }
};
