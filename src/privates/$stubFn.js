/* global jasmine, sinon */

var sinonExists = (function() {
  try{
    var n = 'sinon'; // eslint-disable-line
    return !!eval('require(n)');
  }catch(e){
    return false;
  }
}());

function defaultStubFn() {
  if (typeof jasmine !== 'undefined' && typeof jasmine.createSpy === 'function'){
    return jasmine.createSpy();
  }else if (typeof sinon !== 'undefined' && typeof sinon.spy === 'function'){
    return sinon.spy();
  }else if (sinonExists){
    return (function(){
      var n = 'sinon'; // eslint-disable-line
      return eval('require(n)').spy();
    }());
  }else{
    return function(){};
  }
}

var $stubFn = {
  get : function () {
    return this.$$mock.stubFn || this.$$parent.$stubFn || defaultStubFn;
  },
  set : function (fn) {
    if (fn && typeof fn !== 'function'){
      throw new Error('$stubFn must be supplied with a [Function]');
    }
    this.$$mock.stubFn = fn;
  }
};

module.exports = $stubFn;
