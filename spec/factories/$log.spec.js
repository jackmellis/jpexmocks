import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $log = Jpex.$get('$log');
  t.context = {$log, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should not call the console", function (t) {
  let {$log, sinon} = t.context;

  sinon.stub(console, 'log');
  $log('message');
  t.false(console.log.called);
});

test("should track messages", function (t) {
  let {$log, sinon} = t.context;

  var expected = ['a', 'b', 'c', 'd'];
  $log('a');
  $log.log('b');
  $log.warn('c');
  $log.error('d');
  t.deepEqual($log.messages, expected);
});
