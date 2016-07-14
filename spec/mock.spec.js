/* globals describe, expect, it, beforeEach, afterEach ,spyOn*/

var grequire = require('./grequire');

describe('Base Class - Mock', function(){
  var Base, Master, Mock, mock;
  
  beforeEach(function(){
    Base = grequire('node_modules/jpex');
    Master = Base.extend();
    Mock = grequire('.');
    mock = Mock(Master);
  });

  it('should be a function', function(){
    expect(typeof Mock).toBe('function');
  });
  it('should return a mock object', function(){
    expect(typeof mock).toBe('object');
    expect(mock.get).toBeDefined();
    expect(mock.set).toBeDefined();
    expect(mock.inject).toBeDefined();
    expect(Master.mock).toBe(mock);
  });
  it('should mock out $ injections', function(){
    expect(Master._factories.$timeout).toBeDefined();
  });
  
  it('should mock out the base class by default', function(){
    expect(Base.mock).toBeUndefined();
    Mock();
    expect(Base.mock).toBeDefined();
    Base.mock.reset();
    expect(Base.mock).toBeUndefined();
  });
  
  describe('get', function(){
    it('should get a dependency', function(){
      var obj = {};
    
      Master.Register.Factory('test', () => obj);
      
      var get = mock.get('test');
      
      expect(get).toBe(obj);
    });
    it('should get an ancestor dependency', function(){
      var obj = {};
      Master.Register.Factory('test', () => obj);
      
      var Class = Master.extend();
      Mock(Class);
      
      var get = Class.mock.get('test');
      
      expect(get).toBe(obj);
    });
    it('should get an array of dependencies', function(){
      Master.Register.Constant('A', 'a');
      Master.Register.Constant('B', 'b');
      Master.Register.Constant('C', 'c');
      
      var get = mock.get(['A', 'B', 'C']);
      
      expect(get.length).toBe(3);
    });
  });
  
  describe('set', function(){
    it('should set a constant', function(){
      var obj = {}, result;
      
      var Class = Master.extend(function(test){
        result = test;
      });
      Class.Register.Factory('test', () => 'x');
      
      new Class();
      expect(result).toBe('x');
      
      Mock(Class).set('test', obj);
      
      new Class();
      expect(result).toBe(obj);
    });
    it('should set a factory', function(){
      var obj = {}, fn = () => obj, result;
      
      var Class = Master.extend(function(test){
        result = test;
      });
      
      Mock(Class).set('test', fn);
      
      new Class();
      expect(result).toBe(obj);
    });
    it('should store the old dependency', function(){
      var obj = {}, result;
      
      var Class = Master.extend(function(test){
        result = test;
      });
      Class.Register.Factory('test', () => 'x');
      
      new Class();
      expect(result).toBe('x');
      
      Mock(Class).set('test', obj);
      
      expect(Class._mock.factories.test).toBeDefined();
      expect(Class._mock.factories.test).not.toEqual(Class._factories.test);
    });
  });
  
  describe('inject', function(){
    it('should get dependencies', function(){
      var obj = {}, result;
      Master.Register.Constant('test', obj);
      mock.inject(function(test){
        result = test;
      });
      expect(result).toBe(obj);
    });
    it('should return dependencies', function(){
      var obj = {}, result;
      
      var Class = Master.extend(function(test){
        result = test;
      });
      
      mock.inject(function(){
        return {test : obj};
      });
      
      new Class();
      expect(result).toBe(obj);
    });
    it('should manipulate dependencies', function(){
      var obj = {
        x : 'x'
      };
      var result;
      Master.Register.Constant('test', obj);
      var Class = Master.extend(function(test){
        result = test;
      });
      
      new Class();
      expect(result.x).toBe('x');
      
      Mock(Class).inject(function(test){
        test.x = 'y';
      });
      
      new Class();
      expect(result.x).toBe('y');
    });
  });
  
  describe('reset', function(){
    it('should remove all mocking properties from the class', function(){
      expect(Master._mock).toBeDefined();
      mock.reset();
      expect(Master._mock).toBeUndefined();
    });
    it('should not removing mocking properties from children by default', function(){
      var Class = Master.extend();
      expect(Master._mock).toBeDefined();
      expect(Class._mock).toBeDefined();
      
      mock.reset();
      expect(Master._mock).toBeUndefined();
      expect(Class._mock).toBeDefined();
    });
    it('should remove all mocking properties from child classes', function(){
      var Class = Master.extend();
      expect(Master._mock).toBeDefined();
      expect(Class._mock).toBeDefined();
      
      mock = Mock(Master);
      mock.reset(true);
      expect(Master._mock).toBeUndefined();
      expect(Class._mock).toBeUndefined();
    });
    it('should set the factories back to their original values', function(){
      var obj = {}, result;
      Master.Register.Constant('test', obj);
      var Class = Master.extend(function(test){
        result = test;
      });
      
      mock.set('test', 'x');
      
      new Class();
      expect(result).toBe('x');
      
      mock.reset();
      new Class();
      expect(result).toBe(obj);
    });
  });
  
  describe('$timeout', function(){
    it('should mock out $timeout', function(){
      var callCount = 0;
    
      var Class = Master.extend(function($timeout){
        $timeout(function(){
          callCount++;
        }, 250);
      });
      
      var $t = mock.get('$timeout');
      
      expect($t).toBeDefined();
      expect($t.flush).toBeDefined();
      expect($t.count).toBeDefined();
      expect($t.count()).toBe(0);
      
      new Class();
      expect($t.count()).toBe(1);
      expect(callCount).toBe(0);
      
      $t.flush();
      expect($t.count()).toBe(0);
      expect(callCount).toBe(1);
    });
    it('should not flush more than once', function(){
      var $t = mock.get('$timeout');
      var err;
      try{
        $t.flush();
      }
      catch(e){
        err = e;
      }
      finally{
        expect(err).toBeDefined();
      }
    });
    it('should force a flush', function(){
      var $t = mock.get('$timeout');
      $t.flush(true);
    });
    it('can overwrite the mocked out $timeout', function(){
      var obj = {}, result;
      var Class = Master.extend(function($timeout){
        result = $timeout;
      });
      
      Mock(Class).set('$timeout', obj);
      
      new Class();
      expect(result).toBe(obj);
    });
  });
  
  describe('$log', function(){
    it('should mock out the $log service', function(){
      var Class = Master.extend(function($log){
          $log('direct');
          $log.log('log');
          $log.warn('warn');
          $log.error('error');
      });
      
      var $log = mock.get('$log');
      spyOn($log, 'log');
      spyOn($log, 'warn');
      spyOn($log, 'error');
      spyOn(console, 'log');
      spyOn(console, 'warn');
      spyOn(console, 'error');

      new Class();

      expect($log.log).toHaveBeenCalledWith('direct');
      expect($log.log).toHaveBeenCalledWith('log');
      expect($log.warn).toHaveBeenCalledWith('warn');
      expect($log.error).toHaveBeenCalledWith('error');
      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
    });
  });
});