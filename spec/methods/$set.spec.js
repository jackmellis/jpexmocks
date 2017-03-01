describe("$set", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should set a factory", function () {
    Jpex.register.factory('factory', () => 'real');
    expect(Jpex.$get('factory')).toBe('real');

    Jpex.$set('factory', function (path) {
      expect(path).toBe(require('path'));
      return 'fake';
    });
    expect(Jpex.$get('factory')).toBe('fake');
  });
  it("should be inheritable", function () {
    Jpex.$set('factory', function (path) {
      expect(path).toBe(require('path'));
      return 'fake';
    });
    var Class = Jpex.extend();
    Class.register.factory('factory', () => 'real');
    expect(Class.$get('factory')).toBe('fake');
  });
  it("should set a constant", function () {
    Jpex.register.constant('constant', 'real');
    expect(Jpex.$get('constant')).toBe('real');

    Jpex.$set('constant', 'fake');
    expect(Jpex.$get('constant')).toBe('fake');
  });
  it("should not overwrite a factory registered on the class", function () {
    Jpex.register.constant('foo', 'bah');
    var f = Jpex.$$factories.foo;

    Jpex.$set('foo', 'boo');

    expect(Jpex.$$factories.foo).toBe(f);
  });
  it("should not overwrite an inherited factory", function () {
    Jpex.register.constant('foo', 'bah');
    var Class = Jpex.extend();

    var f = Jpex.$$factories.foo;
    Jpex.$set('foo', 'boo');

    expect(Jpex.$$factories.foo).toBe(f);
    expect(Object.hasOwnProperty.call(Jpex.$$factories)).toBe(false);
  });
  it("should not store the factory directly on the class", function () {
    Jpex.$set('foo', 'boo');
    expect(Jpex.$$factories.foo).toBeUndefined();
  });
});
