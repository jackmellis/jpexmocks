import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $immediate = Jpex.$get('$immediate');
  t.context = {$immediate, sinon};
});

test("should not set a real immediate", function (t) {
  let {$immediate, sinon} = t.context;

  var spy = sinon.spy();
  $immediate(spy);

  return new Promise(resolve => {
    setTimeout(function () {
      t.false(spy.called);
      resolve();
    }, 100);
  });
});
test("should flush an immediate", function (t) {
  let {$immediate, sinon} = t.context;

  var spy = sinon.spy();
  $immediate(spy);
  $immediate.flush();
  t.true(spy.called);
});
test("should clear an immediate", function (t) {
  let {$immediate, sinon} = t.context;

  var spy = sinon.spy();
  var i = $immediate(spy);
  $immediate.clear(i);
  $immediate.flush();
  t.false(spy.called);
});
test("should flush multiple immediates", function (t) {
  let {$immediate, sinon} = t.context;

  var spy = sinon.spy();
  var spy2 = sinon.spy();
  $immediate(spy);
  $immediate(spy2);
  $immediate.flush();
  t.true(spy.called);
  t.true(spy2.called);
});
test("should count the number of outstanding items", function (t) {
  let {$immediate, sinon} = t.context;

  $immediate(() => {}, 10);
  $immediate(() => {}, 10);
  t.is($immediate.count(), 2);
});

test('should return a promise', function (t) {
  let {$immediate, sinon} = t.context;
  let spy = sinon.spy();

  $immediate().then(spy);

  t.false(spy.called);
  $immediate.flush();
  t.true(spy.called);
});
