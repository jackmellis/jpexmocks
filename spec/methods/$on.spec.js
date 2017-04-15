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

test("should add an event listener", function (t) {
  let {sinon, Jpex} = t.context;

  var spy = sinon.spy();
  Jpex.$on('created', spy);

  Jpex();

  t.true(spy.called);
});
