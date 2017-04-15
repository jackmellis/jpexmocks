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

test("should get a dependency", function (t) {
  let {Jpex} = t.context;

  var path = Jpex.$get('path');
  var realPath = require('path');
  t.is(path, realPath);
});
