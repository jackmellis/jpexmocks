import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);

  t.context = {Jpex, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should error if no function provided", function (t) {
  let {Jpex, sinon} = t.context;

  t.throws(() => Jpex.$beforeInvoke());
});
test("should call a function before invoking", function (t) {
  let {Jpex, sinon} = t.context;

  var order = [];
  var spy1 = sinon.stub().callsFake(() => order.push(1));
  var spy2 = sinon.stub().callsFake(() => order.push(2));
  var Class = Jpex.extend(spy1);
  Class.$beforeInvoke = (spy2);

  Class();

  t.true(spy1.called);
  t.true(spy2.called);

  t.deepEqual(order, [2, 1]);
});
test("should pass in the class's dependencies", function (t) {
  let {Jpex, sinon} = t.context;

  var spy = sinon.stub();
  var path = require('path');
  var Class = Jpex.extend({dependencies : 'path'});
  Class.$beforeInvoke = (spy);
  Class();

  t.true(spy.calledWith(path));
});
test("should have the instance context", function (t) {
  let {Jpex, sinon} = t.context;

  var calledWith = {};
  Jpex.$beforeInvoke = (function () {
    calledWith = this;
  });
  Jpex();

  t.is(calledWith, Jpex.$instances[0]);
});
test("should not fire on child classes", function (t) {
  let {Jpex, sinon} = t.context;

  var called = false;
  Jpex.$beforeInvoke = (() => called = true);
  var Class = Jpex.extend();

  Class();
  t.is(called, false);
  Jpex();
  t.is(called, true);
});
