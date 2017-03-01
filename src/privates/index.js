var createMockObject = require('./mock');
var $descendants = require('./$descendants');
var $set = require('./$set');
var $inject = require('./$inject');
var $unset = require('./$unset');
var $freeze = require('./$freeze');
var $on = require('./$on');
var $reset = require('./$reset');

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

function $beforeInvoke(fn) {
  if (typeof fn !== 'function'){
    throw new Error('$beforeInvoke must be supplied with a [Function]');
  }
  this.$$mock.beforeInvoke.push(fn);
}

function $afterInvoke(fn) {
  if (typeof fn !== 'function'){
    throw new Error('$afterInvoke must be supplied with a [Function]');
  }
  this.$$mock.afterInvoke.push(fn);
}

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
    $beforeInvoke : asValue($beforeInvoke),
    $afterInvoke : asValue($afterInvoke),
    $get : asValue($get),
    $set : asValue($set),
    $inject : asValue($inject),
    $unset : asValue($unset),
    $freeze : asValue($freeze),
    $on : asValue($on),
    $reset : asValue($reset)
  };
};
