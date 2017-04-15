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

test("should have a $children property", function (t) {
  let {Jpex} = t.context;

  t.not(Jpex.$children, undefined);
  t.is(Jpex.$children.length, 0);
});
test("should add new children to the property", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  var Class2 = Jpex.extend();

  t.is(Jpex.$children.length, 2);
  t.is(Jpex.$children[0], Class);
  t.is(Jpex.$children[1], Class2);
});
test("should only add direct children", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  var Class2 = Class.extend();

  t.is(Jpex.$children.length, 1);
  t.is(Jpex.$children[0], Class);
  t.is(Class.$children[0], Class2);
});
test("should not be mutatable", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();

  var children = Jpex.$children;

  children.push({});

  t.is(children.length, 2);
  t.is(Jpex.$children.length, 1);
});
