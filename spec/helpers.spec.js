/* globals describe, expect, it, beforeEach, afterEach ,spyOn*/

var grequire = require('./grequire');

describe('Base Class - Mock - Helpers', function(){
  var Base, Master, Mock, mock;
  
  beforeEach(function(){
    Base = grequire('node_modules/jpex');
    Master = Base.extend();
    Mock = grequire('.');
    Mock(Master);
  });
  
  describe('Children', function(){
    it('should have a list of children', function(){
      expect(Master.mock.children).toBeDefined();
      expect(Master.mock.children.length).toBe(0);
    });
    it('should add to the list when the class is extended', function(){
      var Second = Master.extend();
      var Third = Master.extend();
      
      expect(Master.mock.children.length).toBe(2);
    });
    it('should not add grandchildren etc.', function(){
      var Second = Master.extend();
      var Third = Master.extend();
      var Fourth = Second.extend();
      var Fifth = Second.extend();
      var Sixth = Fifth.extend();
      
      expect(Master.mock.children.length).toBe(2);
      expect(Second.mock.children.length).toBe(2);
      expect(Third.mock.children.length).toBe(0);
      expect(Fourth.mock.children.length).toBe(0);
      expect(Fifth.mock.children.length).toBe(1);
    });
  });
  
  describe('Instances', function(){
    beforeEach(function(){
      // Instances are only registered on sub classes of the mocked object
      Master = Master.extend();
    });
  
    it('should have a list of instances', function(){
      expect(Master.mock.instances).toBeDefined();
      expect(Master.mock.instances.length).toBe(0);
    });
    it('should add to the list when an instance is created', function(){
      var instance = new Master();
      expect(Master.mock.instances.length).toBe(1);
      expect(Master.mock.instances[0]).toBe(instance);
      
      new Master();
      expect(Master.mock.instances.length).toBe(2);
    });
    it('should preserve any options passed in', function(){
      var result;
      var Second = Master.extend({
        dependencies : [],
        constructor : function(){result = 'Second'},
        invokeParent : false
      });
      new Second();
      expect(result).toBe('Second');
      
      var Third = Master.extend({
        constructor : function(){result = 'Third';}
      });
      new Third();
      expect(result).toBe('Third');
      result = null;
      var Fourth = Third.extend({});
      new Fourth();
      expect(result).toBe('Third');
    });
    
    it('should restore the class', function(){
      Master.mock.reset();
      new Master();
    });
  });
  
  describe('Before/After invoke', function(){
    it('should invoke a function before constructing', function(){
      var callCount = 0;
      var sharedPromise;
      var Class = Master.extend(function($promise){
        callCount++;
        expect(sharedPromise).toBe($promise);
      });
      Class.mock.beforeInvoke(function($promise, $log){
        expect($promise).toBeDefined(); // Got from the Class
        expect($log).toBeDefined(); // Got from elsewhere
        callCount++;
        sharedPromise = $promise;
      });
      new Class();
      expect(callCount).toBe(2);
    });
    it('should invoke a function after constructing', function(){
      var callCount = 0;
      var Class = Master.extend(function($promise){
        callCount++;
      });
      Class.mock.afterInvoke(function($promise, $log){
        expect($promise).toBeDefined();
        expect($log).toBeDefined();
        callCount++;
      });
      new Class();
      expect(callCount).toBe(2);
    });
    it('should pass new arguments into the main function', function(){
      var Class = Master.extend(function($promise){
        expect($promise).toBe('gone!');
      });
      Class.mock.beforeInvoke(function(){
        return {
          $promise : 'gone!'
        };
      });
      Class.mock.afterInvoke(function($promise){
        expect($promise).toBe('gone!');
      });
      
      new Class();
    });
    it('should not invoke the functions after resetting', function(){
      var callCount = 0;
      var Class = Master.extend(function(){
        callCount++;
      });
      Class.mock.beforeInvoke(function(){
        callCount++;
      });
      Class.mock.afterInvoke(function(){
        callCount++;
      });
      
      new Class();
      expect(callCount).toBe(3);
      
      Class.mock.reset();
      callCount = 0;
      new Class();
      expect(callCount).toBe(1);
    });
  });
});