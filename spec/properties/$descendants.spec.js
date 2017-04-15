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

test("should have a $descendants property", function (t) {
  let {Jpex} = t.context;

  t.not(Jpex.$descendants, undefined);
  t.is(Jpex.$descendants.length, 0);
});
test("should add new children to the property", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  var Class2 = Jpex.extend();

  t.is(Jpex.$descendants.length, 2);
  t.is(Jpex.$descendants[0], Class);
  t.is(Jpex.$descendants[1], Class2);
});
test("should add children of children", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
    var Class3 = Class.extend();
      var Class5 = Class3.extend();
  var Class2 = Jpex.extend();
    var Class4 = Class2.extend();

  t.is(Jpex.$descendants.length, 5);
  t.is(Class.$descendants.length, 2);
  t.is(Class2.$descendants.length, 1);
  t.is(Class3.$descendants.length, 1);
  t.is(Class4.$descendants.length, 0);
  t.is(Class5.$descendants.length, 0);
});
test("should not be mutatable", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();

  var descendants = Jpex.$descendants;

  descendants.push({});

  t.is(descendants.length, 2);
  t.is(Jpex.$descendants.length, 1);
});
