import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

let Child, beforeCalled, afterCalled, eventCalled;

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);

  // Mocked factory
  Jpex.register.factory('factory', () => 'factory');
  Jpex.$set('factory', 'mocked');
  // Cached factory
  Jpex.register.factory('cached', () => ({})).lifecycle.application();
  Jpex.$resolve('cached');
  // children
  Child = Jpex.extend();
  // before/after invoke
  beforeCalled = 0;
  afterCalled = 0;
  Jpex.$beforeInvoke = () => beforeCalled++;
  Jpex.$afterInvoke = () => afterCalled++;
  // events
  eventCalled = 0;
  Jpex.$on('beforeCreate', () => eventCalled++);
  Jpex.$on('created', () => {});
  // recursion
  Child.register.constant('constant', 'constant');
  Child.$set('constant', 'mocked');
  // instances
  Jpex();

  t.is(Jpex.$get('factory'), 'mocked');
  t.is(Jpex.$$factories.cached.resolved, true);
  t.is(Jpex.$children.length, 1);
  t.is(Jpex.$instances.length, 1);
  t.is(beforeCalled, 1);
  t.is(afterCalled, 1);
  t.is(eventCalled, 1);
  t.is(Child.$get('constant'), 'mocked');

  beforeCalled = 0;
  afterCalled = 0;
  eventCalled = 0;

  Jpex.$reset();

  t.context = {Jpex, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});


test("should remove mocked factories", function(t) {
  let {Jpex} = t.context;

  t.is(Jpex.$get('factory'), 'factory');
});
test("should clear cached dependencies", function (t) {
  let {Jpex} = t.context;

  t.falsy(Jpex.$$factories.cached.resolved);
});
test("should clear instances", function (t) {
  let {Jpex} = t.context;

  t.is(Jpex.$instances.length, 0);
});
test("should clear children", function (t) {
  let {Jpex} = t.context;

  t.is(Jpex.$children.length, 0);
});
test("should remove before/after invoke methods", function (t) {
  let {Jpex} = t.context;

  Jpex();
  t.is(beforeCalled, 0);
  t.is(afterCalled, 0);
});
test("should remove $on events", function (t) {
  let {Jpex} = t.context;

  Jpex();
  t.is(eventCalled, 0);
});
test("should loop through children", function (t) {
  let {Jpex} = t.context;

  t.is(Child.$get('constant'), 'constant');
});
