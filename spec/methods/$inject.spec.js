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

test("should accept a callback function", function (t) {
  let {Jpex} = t.context;

  return new Promise(resolve => {
    Jpex.$inject(function () {
      t.pass();
      resolve();
    });
  });
});
test("should inject arguments", function (t) {
  let {Jpex} = t.context;

  return new Promise(resolve => {
    Jpex.$inject(['path', 'fs'], function (path, fs) {
      t.is(path, require('path'));
      t.is(fs, require('fs'));
      resolve();
    });
  });
});
test("should extract arguments from the function", function (t) {
  let {Jpex} = t.context;

  return new Promise(resolve => {
    Jpex.$inject(function (path, fs) {
      t.is(path, require('path'));
      t.is(fs, require('fs'));
      resolve();
    });
  });
});
test("should use $set to overwrite dependencies", function (t) {
  let {Jpex} = t.context;

  Jpex.$inject(function () {
    return {
      foo : () => 'bah'
    };
  });

  t.is(Jpex.$get('foo'), 'bah');
});
test("should not overwrite dependencies not passed back", function (t) {
  let {Jpex} = t.context;

  Jpex.register.constant('foo', 'bah');
  Jpex.$inject(function (foo) {
    t.is(foo, 'bah');
    return {
      zoo : 'doo'
    };
  });

  t.is(Jpex.$get('foo'), 'bah');
});
