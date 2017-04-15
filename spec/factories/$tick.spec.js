import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $tick = Jpex.$get('$tick');
  t.context = {$tick, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should not set a real tick", function (t) {
  return new Promise(resolve => {
    let {$tick, sinon} = t.context;

    var spy = sinon.spy();
    $tick(spy);

    setTimeout(function () {
      t.false(spy.called);
      resolve();
    }, 10);
  });
});
test("should flush an tick", function (t) {
  let {$tick, sinon} = t.context;

  var spy = sinon.spy();
  $tick(spy);
  $tick.flush();
  t.true(spy.called);
});
test("should clear an tick", function (t) {
  let {$tick, sinon} = t.context;

  var spy = sinon.spy();
  var i = $tick(spy);
  $tick.clear(i);
  $tick.flush();
  t.false(spy.called);
});
test("should flush multiple ticks", function (t) {
  let {$tick, sinon} = t.context;

  var spy = sinon.spy();
  var spy2 = sinon.spy();
  $tick(spy);
  $tick(spy2);
  $tick.flush();
  t.true(spy.called);
  t.true(spy2.called);
});
test("should count the number of outstanding items", function (t) {
  let {$tick, sinon} = t.context;
  
  $tick(() => {}, 10);
  $tick(() => {}, 10);
  t.is($tick.count(), 2);
});
