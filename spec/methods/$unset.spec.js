import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);

  Jpex.register.factory('factory', [], () => 'factory');
  Jpex.register.constant('constant', 'constant');
  Jpex.$set('factory', 'mocked');
  Jpex.$set('constant', 'mocked');

  t.is(Jpex.$get('factory'), 'mocked');
  t.is(Jpex.$get('constant'), 'mocked');

  t.context = {Jpex, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should unset a mocked factory", function (t) {
  let {Jpex} = t.context;

  Jpex.$unset();
  t.is(Jpex.$get('factory'), 'factory');
  t.is(Jpex.$get('constant'), 'constant');
});
test("should only unset a specific factory", function (t) {
  let {Jpex} = t.context;

  Jpex.$unset('factory');
  t.is(Jpex.$get('factory'), 'factory');
  t.is(Jpex.$get('constant'), 'mocked');
});
test("should not unset real factories", function (t) {
  let {Jpex} = t.context;

  Jpex.$unset();
  Jpex.$unset();
  t.is(Jpex.$get('factory'), 'factory');
  t.is(Jpex.$get('constant'), 'constant');
});
test("should not unset inherited factories", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  Class.register.service('service', function(){
    this.test = 'service';
  });
  Class.$set('service', () => ({ test : 'mocked'}));

  t.is(Class.$get('factory'), 'mocked');
  t.is(Class.$get('constant'), 'mocked');
  t.is(Class.$get('service').test, 'mocked');

  Class.$unset();

  t.is(Class.$get('factory'), 'mocked');
  t.is(Class.$get('constant'), 'mocked');
  t.is(Class.$get('service').test, 'service');
});

test("should unset inherited factories", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  Class.register.service('service', function(){
    this.test = 'service';
  });
  Class.$set('service', () => ({ test : 'mocked'}));

  t.is(Class.$get('factory'), 'mocked');
  t.is(Class.$get('constant'), 'mocked');
  t.is(Class.$get('service').test, 'mocked');
  Class.$unset(null, true);

  t.is(Class.$get('factory'), 'factory');
  t.is(Class.$get('constant'), 'constant');
  t.is(Class.$get('service').test, 'service');
});
test("should unset child factories", function (t) {
  let {Jpex} = t.context;

  var Class = Jpex.extend();
  Class.register.service('service', function(){
    this.test = 'service';
  });
  Class.$set('service', () => ({ test : 'mocked'}));

  t.is(Class.$get('factory'), 'mocked');
  t.is(Class.$get('constant'), 'mocked');
  t.is(Class.$get('service').test, 'mocked');

  Jpex.$unset(null, false, true);

  t.is(Class.$get('factory'), 'factory');
  t.is(Class.$get('constant'), 'constant');
  t.is(Class.$get('service').test, 'service');
});
test("should unset parent and child factories", function (t) {
  let {Jpex} = t.context;

  var Middle = Jpex.extend();
  Middle.register.service('service', function(){
    this.test = 'service';
  });
  Middle.$set('service', () => ({ test : 'mocked'}));

  var Child = Middle.extend();
  Child.$set('constant', 'child-constant');

  t.is(Jpex.$get('factory'), 'mocked');
  t.is(Jpex.$get('constant'), 'mocked');

  t.is(Middle.$get('factory'), 'mocked');
  t.is(Middle.$get('constant'), 'mocked');
  t.is(Middle.$get('service').test, 'mocked');

  t.is(Child.$get('factory'), 'mocked');
  t.is(Child.$get('constant'), 'child-constant');
  t.is(Child.$get('service').test, 'mocked');

  Middle.$unset(null, true, true);

  t.is(Jpex.$get('factory'), 'factory');
  t.is(Jpex.$get('constant'), 'constant');

  t.is(Middle.$get('factory'), 'factory');
  t.is(Middle.$get('constant'), 'constant');
  t.is(Middle.$get('service').test, 'service');

  t.is(Child.$get('factory'), 'factory');
  t.is(Child.$get('constant'), 'constant');
  t.is(Child.$get('service').test, 'service');
});
