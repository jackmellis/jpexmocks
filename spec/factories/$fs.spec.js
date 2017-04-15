import test from 'ava';
import jpex from 'jpex';
import plugin from '../../src';

test.skip.beforeEach(function (t) {
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $fs = Jpex.$get('$fs');
  $fs.use({
    'ant/bear/cat' : 'file1.js',
    'ant/bat/croc' : 'file2.js'
  });
  t.context = {$fs};
});

test.failing('should use a file system', function(t){
  let {$fs} = t.context;

  t.is(typeof $fs.use, 'function');
});

test.failing('should have callbackable functions from fs', function(t){
  let {$fs} = t.context;

  t.not($fs.write, undefined);
  t.is(typeof $fs.stat, 'function');
});

test.failing('should work as a promise', function(t){
  let {$fs} = t.context;

  var result;

  $fs.readdir('./ant')
    .then(function(arr){
      result = arr;
    });

  $fs.flush();

  t.is(result.length, 2);
  t.true(result.indexOf('bear') > -1);
  t.true(result.indexOf('bat') > -1);
});

test.failing('should catch errors', function(t){
  let {$fs} = t.context;
  var e;

  $fs.readdir('./doesnot/exist')
    .catch(function(err){
      e = err;
    });

  $fs.flush();

  t.not(e, undefined);
});

test.failing('should have non-callback method', function(t){
  let {$fs} = t.context;

  t.not($fs.createReadStream, undefined);
});
