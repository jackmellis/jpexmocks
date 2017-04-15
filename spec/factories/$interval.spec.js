import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $interval = Jpex.$get('$interval');
  t.context = {$interval, sinon};
});

test("should not set a real interval", function (t) {
  let {$interval, sinon} = t.context;

  var spy = sinon.stub();
  $interval(spy, 10);

  return new Promise(resolve => {
    setTimeout(function () {
      t.false(spy.called);
      resolve();
    }, 100);
  });
});
test("should flush an interval", function (t) {
  let {$interval, sinon} = t.context;

  var spy = sinon.stub();
  $interval(spy, 10);
  $interval.flush();
  $interval.flush();
  t.true(spy.called);
  t.true(spy.calledTwice);
});
test("should clear an interval", function (t) {
  let {$interval, sinon} = t.context;

  var spy = sinon.stub();
  var i = $interval(spy, 10);
  $interval.clear(i);
  $interval.flush();
  t.false(spy.called);
});
test("should flush multiple intervals", function (t) {
  let {$interval, sinon} = t.context;

  var spy = sinon.stub();
  var spy2 = sinon.stub();
  $interval(spy, 10);
  $interval(spy2, 20);
  $interval.flush();
  t.true(spy.called);
  t.true(spy2.called);
});
test("should count the number of outstanding items", function (t) {
  let {$interval, sinon} = t.context;

  $interval(() => {}, 10);
  $interval(() => {}, 10);
  t.true($interval.count() === 2);
});
test("should not flush intervals that haven't elapsed yet", function (t) {
  let {$interval, sinon} = t.context;

  $interval.flush(900);
  var spy = sinon.stub();
  $interval(spy, 1000);
  $interval.flush(800);
  t.false(spy.called);
  $interval.flush(100);
  t.false(spy.called);
  $interval.flush(100);
  t.true(spy.called);
});
