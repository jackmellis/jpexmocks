describe('$promise', function(){
  var Jpex, Master, Mock, constructor, $promise, plugin;

  beforeEach(function(){
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    Master = Jpex.extend(function($promise){
      constructor($promise);
    });
    constructor = function(){};

    $promise = Master.$get('$promise');
  });

  it('should inject a mock promise factory', function(){
    constructor = function($promise){
      expect($promise).toBeDefined();
      expect($promise.flush).toBeDefined();
    };
    new Master();
  });

  describe('$promise', function(){
    it('should create and resolve a promise', function(){
      var result;

      constructor = function($promise){
        $promise(function(resolve){
          resolve('tada');
        })
        .then(function(data){
          result = data;
        });
      };
      new Master();

      $promise.flush();

      expect(result).toBe('tada');
    });
    it('should create and reject a promise', function(){
      spyOn(console, 'log');
      constructor = function($promise){
        var result = $promise(function(resolve, reject){
          reject('error');
        });
        $promise.flush();
        expect(result.state).toBe('rejected');
        expect(console.log).toHaveBeenCalled();
      };
      new Master();
    });
    it('should catch a rejected promise', function(){
      var result;

      constructor = function($promise){
        $promise(function(resolve, reject){
          reject('error');
        })
        .catch(function(data){
          result = data;
        });
      };
      new Master();

      $promise.flush();

      expect(result).toBe('error');
    });
    it('should not log a rejected promise caught by another promise...', function () {
      spyOn(console, 'log');
      constructor = function ($promise) {
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

        expect(result2.state).toBe('rejected');
        expect(result.state).toBe('fulfilled');
        expect(console.log).not.toHaveBeenCalled();
      };
      new Master();
    });
    it('should not resolve the promise until flushed', function(){
      var result;

      constructor = function($promise){
        $promise(function(resolve){
          resolve('tada');
        })
        .then(function(data){
          result = data;
        });
      };
      new Master();

      expect(result).toBe(undefined);

      $promise.flush();

      expect(result).toBe('tada');
    });
    it('should chain multiple then statements', function(){
      var result;

      constructor = function($promise){
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
      };
      new Master();
      $promise.flush();

      expect(result).toBe('abc');
    });
    it('should skip all thens until a catch is encountered', function(){
      var callCount = 0;

      constructor = function($promise){
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
      };

      new Master();
      $promise.flush();

      expect(callCount).toBe(4);
    });
    it('should flush promises made within promises', function(){
      var callCount = 0;
      constructor = function($promise){
        return $promise(function(resolve){
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
      };

      new Master();
      $promise.flush();

      expect(callCount).toBe(6);
    });
    it('should not resolve then statements of unresolved promises', function(){
      var callCount = 0;
      constructor = function($promise){
        $promise(function(){
          callCount++;
        })
        .then(function(){
          callCount++;
        })
        .then(function(){
          callCount++;
        });
      };

      new Master();
      $promise.flush();

      expect(callCount).toBe(1);
    });
    it('should pick up unresolved then statements on the next pass', function(){
      var resolver;
      var callCount = 0;

      constructor = function($promise){
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
      };

      new Master();
      $promise.flush();

      expect(callCount).toBe(1);

      resolver();

      $promise.flush();

      expect(callCount).toBe(3);
    });

    it('should flush promises added to a completed promise', function(){
      var p = $promise(resolve => resolve(1));
      $promise.flush();

      var result;
      p.then(d => {
        result = d + 1
      });
      $promise.flush();

      expect(result).toBe(2);
    });
    it('should flush promises added to a rejected promise', function(){
      spyOn(console, 'log');
      var p = $promise((resolve, reject) => reject(1));
      $promise.flush();
      var result;
      p
        .then(d => result = d * 10)
        .catch(d => result = d + 1);
      $promise.flush();

      expect(result).toBe(2);
    });
    it('should accept a real promise within a fake promise', function (done) {
      var spy = jasmine.createSpy();
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

      expect(spy).not.toHaveBeenCalled();

      setTimeout(function () {
        expect(spy).not.toHaveBeenCalled();
        $promise.flush();
        setTimeout(function () {
          expect(spy).toHaveBeenCalled();
          done();
        }, 5);
      }, 5);
    });
  });

  describe('Resolve', function(){
    it('should return a resolved promise', function(){
      var result;
      $promise.resolve(1234)
      .then(function(v){
        result = v;
      });
      $promise.flush();

      expect(result).toBe(1234);
    });
  });

  describe('Reject', function(){
    it('should return a rejected promise', function(){
      var result;
      $promise.reject(1234)
      .catch(function(v){
        result = v;
      });
      $promise.flush();

      expect(result).toBe(1234);
    });
  });

  describe('All', function(){
    it('should resolve all promises and return the results', function(){
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

      expect(result).toEqual(expected);
    });
    it('should stop if any promises are rejected', function(){
      spyOn(console, 'log');
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

      expect(result).toEqual(expected);
    });

    it('should resolve multiple promises', function(){
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

      expect(resolved).toBe(true);
    });
  });

  describe('Race', function(){
    it('should stop as soon as any promise is resolved', function(){
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

      expect(result).toBe(expected);
    });
    it('should stop as soon as any promise is rejected', function(){
      spyOn(console, 'log');
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

      expect(result).toBe(expected);
    });
  });

  it('should reset the number of promises between tests', function(){
    expect($promise.promises.length).toBe(0);
  });
});
