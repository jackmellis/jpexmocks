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

test("should stub out a service", function (t) {
  let {Jpex} = t.context;

  Jpex.register.service('service', function () {
    this.foo = function () {
      throw new Error();
    };
    this.bah = function () {
      throw new Error();
    };
  });

  var service = Jpex.$get('service');
  t.throws(() => service.foo());
  t.throws(() => service.bah());

  service = Jpex.$stub('service');
  t.notThrows(() => service.foo());
  t.notThrows(() => service.bah());

  t.true(service.foo.called); // should already be a spy
});
test("should stub prototyped and inherited methods", function (t) {
  let {Jpex} = t.context;

  function Service(){
    this.methodA = function () {
      throw new Error();
    };
  }
  Service.prototype.methodB = function () {
    throw new Error();
  };
  Jpex.register.service('service', Service);

  var service = Jpex.$get('service');
  t.is(Object.hasOwnProperty.call(service, 'methodA'), true);
  t.is(Object.hasOwnProperty.call(service, 'methodB'), false);
  t.throws(() => service.methodA());
  t.throws(() => service.methodB());

  service = Jpex.$stub('service');
  t.is(Object.hasOwnProperty.call(service, 'methodA'), true);
  t.is(Object.hasOwnProperty.call(service, 'methodB'), true);
  t.notThrows(() => service.methodA());
  t.notThrows(() => service.methodB());

  t.true(service.methodA.called);
  t.true(service.methodB.called);
});
test("should create an empty object if the factory doesnt exist", function (t) {
  let {Jpex} = t.context;

  var service = Jpex.$stub('service');
  t.deepEqual(service, {});
  t.is(Jpex.$get('service'), service);
});
test("should stub a function", function (t) {
  let {Jpex} = t.context;

  Jpex.register.factory('factory', function () {
    function fn() {
      throw new Error();
    };
    fn.method = function () {
      throw new Error();
    };
    return fn;
  });

  var f = Jpex.$get('factory');
  t.throws(() => f());
  t.throws(() => f.method());

  f = Jpex.$stub('factory');
  t.notThrows(() => f());
  t.notThrows(() => f.method());
});
test("should overwrite the default stub function", function (t) {
  let {Jpex} = t.context;

  var called = 0;
  Jpex.$stubFn = function () {
    return () => called++;
  }
  Jpex.register.factory('factory', function () {
    return function(){};
  });

  Jpex.$get('factory')();
  t.is(called, 0);

  Jpex.$stub('factory')();
  t.is(called, 1);

  t.is(Jpex.$stub('factory').and, undefined);
});
test("should error if stubFn is not a function", function (t) {
  let {Jpex} = t.context;

  t.notThrows(() => Jpex.$stubFn = null);
  t.throws(() => Jpex.$stubFn = 7);
});
test("should inherit stub functions", function (t) {
  let {Jpex} = t.context;

  var calledBy = null;
  Jpex.register.factory('factory', function () {
    return function(){};
  });
  var Class = Jpex.extend();

  Jpex.$stubFn = function () {
    return () => calledBy = 'Jpex';
  };
  Class.$stubFn = function () {
    return () => calledBy = 'Class';
  };

  Jpex.$get('factory')();
  t.is(calledBy, null);

  Jpex.$stub('factory')();
  t.is(calledBy, 'Jpex');

  Class.$stub('factory')();
  t.is(calledBy, 'Class');

  Jpex.$stub('factory')();
  t.is(calledBy, 'Jpex');
});
