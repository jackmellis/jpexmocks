/* globals describe, expect, it, beforeEach, afterEach ,spyOn*/

var grequire = require('./grequire');

describe('Base Class - Mock - $promise', function(){
  var Base, Master, Mock, constructor, $promise;
  
  beforeEach(function(){
    Base = grequire('node_modules/jpex');
    Master = Base.extend(function($promise){
      constructor($promise);
    });
    constructor = function(){};
    Mock = grequire('.');
    Mock(Master);
    
    $promise = Master.mock.get('$promise');
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
      constructor = function($promise){
        var result = $promise(function(resolve, reject){
          reject('error');
        });
        $promise.flush();
        expect(result.state).toBe('rejected');
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
      var shouldResolve = false;
      var callCount = 0;
      
      constructor = function($promise){
        $promise(function(resolve){
          callCount++;
          if (shouldResolve){
            resolve();
          }
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
      
      shouldResolve = true;
      
      $promise.flush();
      
      expect(callCount).toBe(3);
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