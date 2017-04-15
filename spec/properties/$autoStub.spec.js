import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);

  Jpex.register.factory('factory', function () {
    function result() {
      throw new Error();
    }
    result.method = function () {
      throw new Error();
    };
    return result;
  });
  Jpex.register.service('service', function () {
    this.method = function () {
      throw new Error();
    }
  });

  t.throws(() => Jpex.$get('factory')());
  t.throws(() => Jpex.$get('service').method());

  Jpex.$autoStub = true;

  t.context = {Jpex, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should automatically stub all dependencies", function (t) {
  let {Jpex} = t.context;

  var f = Jpex.$get('factory');
  t.notThrows(() => f());
  t.notThrows(() => f.method());
});

test("should not stub mock factories created with $set", function (t) {
  let {Jpex} = t.context;

  Jpex.$set('factory', function () {
    return function () {
      throw new Error();
    };
  });

  var f = Jpex.$get('factory');
  t.throws(() => f());
});

test("should not stub excluded factories", function (t) {
  let {Jpex} = t.context;

  Jpex.$autoStub = {
    exclude : ['service']
  };

  t.notThrows(() => Jpex.$get('factory')());
  t.throws(() => Jpex.$get('service').method());
});

test("should not stub non-included factories", function (t) {
  let {Jpex} = t.context;

  Jpex.$autoStub = {
    include : ['service']
  };

  t.throws(() => Jpex.$get('factory')());
  t.notThrows(() => Jpex.$get('service').method());
});

test("should not stub if autoStub is disabled", function (t) {
  let {Jpex} = t.context;

  Jpex.$autoStub = false;

  t.throws(() => Jpex.$get('factory')());
  t.throws(() => Jpex.$get('service').method());
});

test("should inherit", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  Class.register.factory('factory', function () {
    return function () {
      throw new Error();
    }
  });

  t.notThrows(() => Jpex.$get('factory')());
});

test("should stub node modules", function (t) {
  let {Jpex} = t.context;

  var path = Jpex.$get('path');
  path.dirname();
  t.true(path.dirname.called);
});
