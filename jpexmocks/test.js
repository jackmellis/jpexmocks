/* globals describe, expect, it, beforeEach, afterEach ,spyOn*/

  var Jpex, Mock, Base;

    Jpex = require('jpex');
    Mock = require('.');
    Mock(Jpex);
    Base = Jpex.extend();



      Base.Register.Interface('iParent', i => i.functionWith({a : i.string, c : i.string}));
      Base.Register.Interface('iChild', i => i.functionWith({b : i.number, c : i.number}), 'iParent');

      var result = Base.mock.create('iChild');

      expect(typeof result.a).toBe('string');
      expect(typeof result.b).toBe('number');
      expect(typeof result.c).toBe('number');
