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

test("should have an $instances property", function (t) {
  let {Jpex} = t.context;

  t.not(Jpex.$instances, undefined);
  t.is(Jpex.$instances.length, 0);
});
test("should add a new instance to the property", function (t) {
  let {Jpex} = t.context;

  Jpex();
  t.is(Jpex.$instances.length, 1);
  Jpex();
  t.is(Jpex.$instances.length, 2);
});
test("should not add indirect instances", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();

  Jpex();
  t.is(Jpex.$instances.length, 1);
  t.is(Class.$instances.length, 0);
  Class();
  t.is(Jpex.$instances.length, 1);
  t.is(Class.$instances.length, 1);
});
test("should not be mutatable", function (t) {
  let {Jpex} = t.context;

  Jpex();
  var instances = Jpex.$instances;
  instances.push({});

  t.is(instances.length, 2);
  t.is(Jpex.$instances.length, 1);
});
