import test from 'ava-spec';
import Sinon from 'sinon';
import jpex from 'jpex';
import plugin from '../../src';

test.beforeEach(function (t) {
  let sinon = Sinon.sandbox.create();
  let Jpex = jpex.extend();
  Jpex.use(plugin);
  let $promise = Jpex.$get('$promise');
  t.context = {$promise, sinon};
});
test.afterEach(function (t) {
  t.context.sinon.restore();
});

test('should inject a mock promise factory', function(t){
  let {$promise, sinon} = t.context;

  t.not($promise, undefined);
  t.not($promise.flush, undefined);
});

test.group('$promise', function(test){
  test('should create and resolve a promise', function(t){
    let {$promise, sinon} = t.context;

    var result;

    $promise(function(resolve){
      resolve('tada');
    })
    .then(function(data){
      result = data;
    });

    $promise.flush();

    t.is(result, 'tada');
  });
  test('should create and reject a promise', function(t){
    let {$promise, sinon} = t.context;

    sinon.stub(console, 'log');

    var result = $promise(function(resolve, reject){
      reject('error');
    });
    $promise.flush();
    t.is(result.state, 'rejected');
    t.true(console.log.called);
  });
  test('should catch a rejected promise', function(t){
    let {$promise, sinon} = t.context;

    var result;

    $promise(function(resolve, reject){
      reject('error');
    })
    .catch(function(data){
      result = data;
    });

    $promise.flush();

    t.is(result, 'error');
  });
  test('should not log a rejected promise caught by another promise...', function(t) {
    let {$promise, sinon} = t.context;

    sinon.stub(console, 'log');
    var rej;
    var result2 = $promise(function (resolve, reject) {
      rej = reject;
    });
    var result = $promise.resolve()
    .then(function () {
       return result2;
    })
    .catch(function () {

    });

    $promise.flush();
    rej();
    $promise.flush();

    t.is(result2.state, 'rejected');
    t.is(result.state, 'fulfilled');
    t.false(console.log.called);
  });
  test('should not resolve the promise until flushed', function(t){
    let {$promise, sinon} = t.context;

    var result;

    $promise(function(resolve){
      resolve('tada');
    })
    .then(function(data){
      result = data;
    });

    t.is(result, undefined);

    $promise.flush();

    t.is(result, 'tada');
  });
  test('should chain multiple then statements', function(t){
    let {$promise, sinon} = t.context;

    var result;

    $promise(function(resolve){
      resolve('a');
    })
    .then(function(str){
      return str + 'b';
    })
    .then(function(str){
      return str + 'c';
    })
    .then(function(str){
      result = str;
    });
    $promise.flush();

    t.is(result, 'abc');
  });
  test('should skip all thens until a catch is encountered', function(t){
    let {$promise, sinon} = t.context;

    var callCount = 0;

    $promise(function(resolve){
      callCount++;
      resolve();
    })
    .then(function(){
      callCount++;
      throw new Error('Uhoh');
    })
    .then(function(){
      callCount++;
    })
    .then(function(){
      callCount++;
    })
    .catch(function(){
      callCount++;
    })
    .then(function(){
      callCount++;
    });
    $promise.flush();

    t.is(callCount, 4);
  });
  test('should flush promises made within promises', function(t){
    let {$promise, sinon} = t.context;

    var callCount = 0;

    $promise(function(resolve){
      callCount++;
      return $promise(function(resolve2, reject2){
        callCount++;
        reject2();
      })
      .catch(function(){
        callCount++;
        return $promise(function(resolve3){
          callCount++;
          resolve3();
        })
        .then(function(){
          callCount++;
          resolve();
        });
      });
    })
    .then(function(){
      callCount++;
    });

    $promise.flush();

    t.is(callCount, 6);
  });
  test('should not resolve then statements of unresolved promises', function(t){
    let {$promise, sinon} = t.context;

    var callCount = 0;

    $promise(function(){
      callCount++;
    })
    .then(function(){
      callCount++;
    })
    .then(function(){
      callCount++;
    });

    $promise.flush();

    t.is(callCount, 1);
  });
  test('should pick up unresolved then statements on the next pass', function(t){
    let {$promise, sinon} = t.context;

    var resolver;
    var callCount = 0;

    $promise(function(resolve){
      callCount++;
      resolver = resolve;
    })
    .then(function(){
      callCount++;
    })
    .then(function(){
      callCount++;
    });

    $promise.flush();

    t.is(callCount, 1);

    resolver();

    $promise.flush();

    t.is(callCount, 3);
  });

  test('should flush promises added to a completed promise', function(t){
    let {$promise, sinon} = t.context;

    var p = $promise(resolve => resolve(1));
    $promise.flush();

    var result;
    p.then(d => {
      result = d + 1
    });
    $promise.flush();

    t.is(result, 2);
  });
  test('should flush promises added to a rejected promise', function(t){
    let {$promise, sinon} = t.context;

    sinon.stub(console, 'log');
    var p = $promise((resolve, reject) => reject(1));
    $promise.flush();
    var result;
    p
      .then(d => result = d * 10)
      .catch(d => result = d + 1);
    $promise.flush();

    t.is(result, 2);
  });
  test('should accept a real promise within a fake promise', function (t) {
    return new Promise(resolve => {
      let {$promise, sinon} = t.context;

      var spy = sinon.stub();
      var p = $promise(function (resolve) {
        return $promise.resolve().then(function () {
          return Promise.resolve().then(function () {
            resolve();
          });
        });
      })
      .then(function () {
        spy();
      })
      .catch(err => console.log(err));

      $promise.flush();

      t.false(spy.called);

      setTimeout(function () {
        t.false(spy.called);
        $promise.flush();
        setTimeout(function () {
          t.true(spy.called);
          resolve();
        }, 5);
      }, 5);
    });
  });
});

test.group('Resolve', function(test){
  test('should return a resolved promise', function(t){
    let {$promise, sinon} = t.context;

    var result;
    $promise.resolve(1234)
    .then(function(v){
      result = v;
    });
    $promise.flush();

    t.is(result, 1234);
  });
});

test.group('Reject', function(test){
  test('should return a rejected promise', function(t){
    let {$promise, sinon} = t.context;

    var result;
    $promise.reject(1234)
    .catch(function(v){
      result = v;
    });
    $promise.flush();

    t.is(result, 1234);
  });
});

test.group('All', function(test){
  test('should resolve all promises and return the results', function(t){
    let {$promise, sinon} = t.context;

    var result;
    var expected = [1234, 5678, 9999];
    var arr = [
      $promise.resolve(1234),
      $promise(function(resolve){
        return $promise(function(resolve2){
          resolve2(5678);
        })
        .then(resolve);
      }),
      9999
    ];

    $promise.all(arr)
    .then(function(r){
      result = r;
    });

    $promise.flush();

    t.deepEqual(result, expected);
  });
  test('should stop if any promises are rejected', function(t){
    let {$promise, sinon} = t.context;

    sinon.stub(console, 'log');
    var result;
    var expected = 0;
    var arr = [
      $promise.reject(0),
      $promise.resolve(1234),
      $promise(function(resolve){
        return $promise(function(resolve2){
          resolve2(5678);
        })
        .then(resolve);
      }),
      9999
    ];

    $promise.all(arr)
    .catch(function(err){
      result = err;
    });

    $promise.flush();

    t.deepEqual(result, expected);
  });

  test('should resolve multiple promises', function(t){
    let {$promise, sinon} = t.context;

    var resolved;

    $promise.all([
      $promise(resolve => resolve()),
      $promise(resolve => resolve()),
      $promise(resolve => resolve()).then(() => true)
    ])
    .then(function(){
      resolved = true;
    });

    $promise.flush();

    t.is(resolved, true);
  });
});

test.group('Race', function(test){
  test('should stop as soon as any promise is resolved', function(t){
    let {$promise, sinon} = t.context;

    var result;
    var expected = 88;
    var arr = [
      $promise(function(){}),
      $promise(function(){}),
      $promise(function(resolve){
        resolve(88);
      }),
      $promise(function(){})
    ];

    $promise.race(arr)
    .then(function(val){
      result = val;
    });

    $promise.flush();

    t.is(result, expected);
  });
  test('should stop as soon as any promise is rejected', function(t){
    let {$promise, sinon} = t.context;

    sinon.stub(console, 'log');
    var result;
    var expected = 99;
    var arr = [
      $promise(function(){}),
      $promise(function(resolve, reject){
        reject(99);
      }),
      $promise(function(resolve){
        resolve(88);
      }),
      $promise(function(){})
    ];

    $promise.race(arr)
    .catch(function(val){
      result = val;
    });

    $promise.flush();

    t.is(result, expected);
  });
});

test('should reset the number of promises between tests', function(t){
  let {$promise, sinon} = t.context;

  t.is($promise.promises.length, 0);
});
