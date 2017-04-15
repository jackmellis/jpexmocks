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

test("should set a factory", function (t) {
  let {Jpex} = t.context;

  Jpex.register.factory('factory', () => 'real');
  t.is(Jpex.$get('factory'), 'real');

  Jpex.$set('factory', function (path) {
    t.is(path, require('path'));
    return 'fake';
  });
  t.is(Jpex.$get('factory'), 'fake');
});
test("should be inheritable", function (t) {
  let {Jpex} = t.context;

  Jpex.$set('factory', function (path) {
    t.is(path, require('path'));
    return 'fake';
  });
  var Class = Jpex.extend();
  Class.register.factory('factory', () => 'real');
  t.is(Class.$get('factory'), 'fake');
});
test("should set a constant", function (t) {
  let {Jpex} = t.context;

  Jpex.register.constant('constant', 'real');
  t.is(Jpex.$get('constant'), 'real');

  Jpex.$set('constant', 'fake');
  t.is(Jpex.$get('constant'), 'fake');
});
test("should not overwrite a factory registered on the class", function (t) {
  let {Jpex} = t.context;

  Jpex.register.constant('foo', 'bah');
  var f = Jpex.$$factories.foo;

  Jpex.$set('foo', 'boo');

  t.is(Jpex.$$factories.foo, f);
});
test("should not overwrite an inherited factory", function (t) {
  let {Jpex} = t.context;

  Jpex.register.constant('foo', 'bah');
  var Class = Jpex.extend();

  var f = Jpex.$$factories.foo;
  Jpex.$set('foo', 'boo');

  t.is(Jpex.$$factories.foo, f);
  t.is(Object.hasOwnProperty.call(Jpex.$$factories), false);
});
test("should not store the factory directly on the class", function (t) {
  let {Jpex} = t.context;
  
  Jpex.$set('foo', 'boo');
  t.is(Jpex.$$factories.foo, undefined);
});
