import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);

  Jpex.register.factory('factory', function () {
    return {};
  });

  t.not(Jpex.$get('factory'), Jpex.$get('factory'));

  t.context = {Jpex, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});


test("should freeze a factory", function (t) {
  let {Jpex, sinon} = t.context;

  var f = Jpex.$freeze('factory');
  t.is(f, Jpex.$get('factory'));
});
test("should freeze a dependency even if it doesn't exist", function (t) {
  let {Jpex, sinon} = t.context;

  var f = Jpex.$freeze('bob');
  t.is(f, undefined);
  t.is(Jpex.$get('bob'), undefined);
});
test("should freeze a factory under a different name", function (t) {
  let {Jpex, sinon} = t.context;

  var f = Jpex.$freeze('factory', 'bob');
  t.not(f, Jpex.$get('factory'));
  t.is(f, Jpex.$get('bob'));
});
test("should accept named parameters", function (t) {
  let {Jpex, sinon} = t.context;
  
  Jpex.register.factory('factory', ['injected'], function (injected) {
    return injected;
  });
  var f = Jpex.$freeze('factory', {injected : 'fred'});
  t.is(f, 'fred');
});
