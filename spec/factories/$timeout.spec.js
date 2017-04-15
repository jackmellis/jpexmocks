import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $timeout = Jpex.$get('$timeout');
  t.context = {$timeout, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should not set a real timeout", function (t) {
  return new Promise(resolve => {
    let {sinon, $timeout} = t.context;

    var spy = sinon.stub();
    $timeout(spy, 10);

    setTimeout(function () {
      t.false(spy.called);
      resolve();
    }, 100);
  });
});
test("should flush a timeout", function (t) {
  let {sinon, $timeout} = t.context;

  var spy = sinon.stub();
  $timeout(spy, 10);
  $timeout.flush();
  t.true(spy.called);
});
test("should clear a timeout", function (t) {
  let {sinon, $timeout} = t.context;

  var spy = sinon.stub();
  var i = $timeout(spy, 10);
  $timeout.clear(i);
  $timeout.flush();
  t.false(spy.called);
});
test("should flush multiple timeouts", function (t) {
  let {sinon, $timeout} = t.context;

  var spy = sinon.stub();
  var spy2 = sinon.stub();
  $timeout(spy, 10);
  $timeout(spy2, 20);
  $timeout.flush();
  t.true(spy.called);
  t.true(spy2.called);
});
test("should count the number of outstanding items", function (t) {
  let {sinon, $timeout} = t.context;

  $timeout(() => {}, 10);
  $timeout(() => {}, 10);
  t.is($timeout.count(), 2);
});
test("should not flush timeouts that haven't elapsed yet", function (t) {
  let {sinon, $timeout} = t.context;

  $timeout.flush(900);
  var spy = sinon.stub();
  $timeout(spy, 1000);
  $timeout.flush(800);
  t.false(spy.called);
  $timeout.flush(100);
  t.false(spy.called);
  $timeout.flush(100);
  t.true(spy.called);
});

test('should return a promise', function (t) {
  let {$timeout, sinon} = t.context;
  let spy = sinon.spy();

  $timeout(1000).then(spy);

  t.false(spy.called);
  $timeout.flush(100);
  t.false(spy.called);
  $timeout.flush(899);
  t.false(spy.called);
  $timeout.flush(1);
  t.true(spy.called);
});
