var createMockObject = require('./mock');
var $descendants = require('./$descendants');
var $set = require('./$set');
var $inject = require('./$inject');
var $unset = require('./$unset');
var $freeze = require('./$freeze');
var $on = require('./$on');
var $reset = require('./$reset');
var $stubFn = require('./$stubFn');
var $stub = require('./$stub');

var $children = {
  get : function(){
    return this.$$mock.children.slice();
  }
};

var $instances = {
  get : function () {
    return this.$$mock.instances.slice();
  }
};

var $beforeInvoke = {
  get : function () {
    return this.$$mock.beforeInvoke;
  },
  set : function (fn) {
    if (fn && typeof fn !== 'function'){
      throw new Error('$beforeInvoke must be supplied with a [Function]');
    }
    this.$$mock.beforeInvoke = fn;
  }
};

var $afterInvoke = {
  get : function () {
    return this.$$mock.afterInvoke;
  },
  set : function (fn) {
    if (fn && typeof fn !== 'function'){
      throw new Error('$afterInvoke must be supplied with a [Function]');
    }
    this.$$mock.afterInvoke = fn;
  }
};

var $autoStub = {
  get : function () {
    return (this.$$mock.autoStub != null) ? this.$$mock.autoStub : this.$$parent.$autoStub;
  },
  set : function (v) {
    this.$$mock.autoStub = v;
  }
};

function asValue(obj) {
  return { value : obj };
}

module.exports = function (Class, Parent) {
  var $$mock = createMockObject(Parent);

  var $get = Class.$resolve;

  return {
    $$mock : asValue($$mock),
    $children : $children,
    $descendants : $descendants,
    $instances : $instances,
    $beforeInvoke : $beforeInvoke,
    $afterInvoke : $afterInvoke,
    $get : asValue($get),
    $set : asValue($set),
    $inject : asValue($inject),
    $unset : asValue($unset),
    $freeze : asValue($freeze),
    $on : asValue($on),
    $reset : asValue($reset),
    $stubFn : $stubFn,
    $stub : asValue($stub),
    $autoStub : $autoStub
  };
};
