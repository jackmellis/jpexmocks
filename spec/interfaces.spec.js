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

      var result = Base.mock.create('iService')
      .concat(Base.mock.create('iService'));

      expect(typeof result).toBe('object');
      expect(Base.Typeof(result)).toBe('array');
      expect(result[0]).toBeDefined();
    });
    it('should create a random number of rows', function(){
      Base.Register.Interface('iService', i => i.arrayOf(i.any()));

      var arr = (new Array(10))
        .fill(null)
        .map(x => Base.mock.create('iService').length);

      var distinct = arr.filter((e, i, a) => a.indexOf(e) === i);

      expect(arr.length).not.toBe(distinct.length);
      expect(distinct.length).toBeGreaterThan(1);
    });
    it('should create a random type', function(){
      Base.Register.Interface('iService', i => i.any());

      var arr = (new Array(10))
        .fill(null)
        .map(x => Base.mock.create('iService'))
        .map(x => typeof x);

      var distinct = arr.filter((e, i, a) => a.indexOf(e) === i);

      expect(distinct.length).toBeGreaterThan(1);
    });
    it('should return a random type from a selection', function(){
      Base.Register.Interface('iService', i => i.either(i.string, i.number));

      var arr = (new Array(10))
        .fill(null)
        .map(x => Base.mock.create('iService'))
        .map(x => typeof x);

      var distinct = arr.filter((e, i, a) => a.indexOf(e) === i);

      expect(distinct.length).toBeGreaterThan(1);
      expect(arr.length).not.toBe(distinct.length);

      arr.forEach(x => expect(['string', 'number'].indexOf(x)).toBeGreaterThan(-1));
    });

    it('should create interface members for nested interfaces', function () {
      Base.Register.Interface('iParent', i => i.functionWith({a : i.string, c : i.string}));
      Base.Register.Interface('iChild', i => i.functionWith({b : i.number, c : i.number, d : i.arrayOf(i.string)}), 'iParent');

      var result = Base.mock.create('iChild');
      expect(typeof result.a).toBe('string');
      expect(typeof result.b).toBe('number');
      expect(typeof result.c).toBe('number');
      expect(typeof result.d[0]).toBe('string');
    });
  });

  describe('Create Many', function(){
    it('should create a factory multiple times', function(){
      var count = 0;
      Base.Register.Factory('myFactory', () => count++);
      var result = Base.mock.createMany('myFactory', 5);
      expect(result.length).toBe(5);

      result.forEach((e, i) => expect(e).toBe(i));
    });
    it('should create an interface object multiple times', function(){
      Base.Register.Interface('iService', i => i.any());

      var result = Base.mock.createMany('iService', 5);
      expect(result.length).toBe(5);
    });
  });

  describe('Freeze', function(){
    it('should create a factory instance', function() {
      Base.Register.Factory('myFactory', () => ({}));
      var result = Base.mock.freeze('myFactory');
      expect(typeof result).toBe('object');
    });
    it('should register the factory instance', function () {
      Base.Register.Factory('myFactory', () => {});
      var original = Base._factories.myFactory;
      Base.mock.freeze('myFactory');
      expect(Base._factories.myFactory).not.toBe(original);
    });
    it('should accept an alias', function () {
      Base.Register.Factory('myFactory', () => {});
      var original = Base._factories.myFactory;
      Base.mock.freeze('myFactory', 'alias');

      expect(Base._factories.myFactory).toBe(original);
      expect(Base._factories.alias).toBeDefined();
    });

    it('should create an interface object', function () {
      Base.Register.Interface('iService', i => i.string);
      var result = Base.mock.freeze('iService');
      expect(typeof result).toBe('string');
    });
    it('should register the instance', function(){
      Base.Register.Interface('iService', i => i.string);
      expect(Object.keys(Base._factories).length).toBe(0);
      Base.mock.freeze('iService');
      expect(Object.keys(Base._factories).length).toBe(1);
    });
    it('should accept an alias', function () {
      Base.Register.Interface('iService', i => i.string);
      Base.mock.freeze('iService', 'myFactory');
      expect(Base._factories.myFactory).toBeDefined();
    });
    it('should default the alias', function () {
      Base.Register.Interface('iService', i => i.string);
      Base.mock.freeze('iService');
      var name = Object.keys(Base._factories)[0];
      expect(name.indexOf('frozen')).toBeGreaterThan(-1);
    });

    it('should use the frozen value to inject dependencies into the class', function () {
      Base.Register.Interface('iService', i => ({
        x : i.string
      }));
      var result;
      var Class = Base.extend(function(iService){
        result = iService;
      });

      var service = Class.mock.freeze('iService');
      expect(typeof service.x).toBe('string');
      service.x = 'injected';

      new Class();
      expect(result.x).toBe('injected');
    });
    it('should still give named parameters priority', function () {
      Base.Register.Interface('iService', i => ({
        x : i.string
      }));
      var result;
      var Class = Base.extend(function(iService){
        result = iService;
      });

      var service = Class.mock.freeze('iService');
      expect(typeof service.x).toBe('string');
      service.x = 'injected';

      var params = {
        iService : {
          x : 'params'
        }
      };

      new Class(params);
      expect(result.x).toBe('params');
    });
  });
});
