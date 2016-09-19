/* globals describe, expect, it, beforeEach, afterEach ,spyOn*/

var grequire = require('./grequire');

describe('Jpex Mocks - Interfaces', function(){
  var Jpex, Mock, Base;
  
  beforeEach(function(){
    Jpex = grequire('node_modules/jpex');
    Mock = grequire('.');
    Mock(Jpex);
    Base = Jpex.extend();
  });
  afterEach(function(){
    Jpex.mock.reset(true);
  });
  
  describe('Create', function(){
    it('should get a standard registered factory', function(){
      var obj = {};
      Base.Register.Factory('myFactory', () => obj);
      
      var result = Base.mock.create('myFactory');
      expect(result).toBe(obj);
    });
    it('should error if no existing factory can be found', function(){
      var fn = function(){
        Base.mock.create('myFactory');
      };
      
      expect(fn).toThrow();
    });
    it('should get an interface', function(){
      Base.Register.Interface('iService', i => ({a : i.string, b : i.number}));
      
      var result = Base.mock.create('iService');
      
      expect(typeof result).toBe('object');
      expect(typeof result.a).toBe('string');
      expect(typeof result.b).toBe('number');
    });
    it('should create a string', function(){
      Base.Register.Interface('iService', i => i.string);
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('string');
      expect(result).not.toBe('');
      expect(result.indexOf('string')).toBe(0);
    });
    it('should create a number', function(){
      Base.Register.Interface('iService', i => i.number);
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });
    it('should create null', function(){
      Base.Register.Interface('iService', i => i.null);
      
      var result = Base.mock.create('iService');
      expect(result).toBe(null);
    });
    it('should create a regular expression', function(){
      Base.Register.Interface('iService', i => (/abc/));
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('object');
      expect(Base.Typeof(result)).toBe('regexp');
    });
    it('should create a date', function(){
      Base.Register.Interface('iService', i => (new Date()));
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('object');
      expect(Base.Typeof(result)).toBe('date');
    });
    it('should create a function', function(){
      Base.Register.Interface('iService', i => i.function);
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('function');
    });
    it('should create function properties', function(){
      Base.Register.Interface('iService', i => i.functionWith({a : i.string}));
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('function');
      expect(typeof result.a).toBe('string');
    });
    it('should create an object', function(){
      Base.Register.Interface('iService', i => i.object);
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('object');
    });
    it('should create object properties', function(){
      Base.Register.Interface('iService', i => ({a : i.null}));
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('object');
      expect(result.a).toBe(null);
    });
    it('should create an array', function(){
      Base.Register.Interface('iService', i => i.array);
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('object');
      expect(Base.Typeof(result)).toBe('array');
      expect(result.length).toBe(0);
    });
    it('should create an array with a row', function(){
      Base.Register.Interface('iService', i => i.arrayOf(i.any()));
      
      var result = Base.mock.create('iService');
      expect(typeof result).toBe('object');
      expect(Base.Typeof(result)).toBe('array');
      expect(result[0]).toBeDefined();
    });
    it('should create a random number of rows', function(){
      Base.Register.Interface('iService', i => i.arrayOf(i.any()));
      
      var arr = [Base.mock.create('iService').length, Base.mock.create('iService').length];
      expect(arr[0]).not.toBe(arr[1]);
    });
    it('should create a random type', function(){
      Base.Register.Interface('iService', i => i.any());
      
      var arr = [
        Base.mock.create('iService'),
        Base.mock.create('iService')
      ];
      
      expect(Base.Typeof(arr[0])).not.toBe(Base.Typeof(arr[1]));
    });
    it('should return a random type from a selection');
  });
  
  describe('Create Many', function(){
    it('should create a factory multiple times');
    it('should create an interface object multiple times');
  });
  
  describe('Freeze', function(){
    it('should create a factory instance');
    it('should register the factory instance');
    it('should accept an alias');
    it('should default the alias');
    
    it('should create an interface object');
    it('should register the instance');
    it('should accept an alias');
    it('should default the alias');
    
    it('should use the frozen value to inject dependencies into the class');
    it('should still give named parameters priority');
  });
});