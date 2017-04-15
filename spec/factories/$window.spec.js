import test from 'ava';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $window = Jpex.$get('$window');
  let $document = Jpex.$get('$document');
  t.context = {$window, $document, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test("should return an injectable object", function (t) {
  let {$window, $document} = t.context;
  t.not($window, undefined);
  t.not($document, undefined);
  t.is($window.document, $document);
});
