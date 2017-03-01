describe("$freeze", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);

    Jpex.register.factory('factory', function () {
      return {};
    });

    expect(Jpex.$get('factory')).not.toBe(Jpex.$get('factory'));
  });

  it("should freeze a factory", function () {
    var f = Jpex.$freeze('factory');
    expect(f).toBe(Jpex.$get('factory'));
  });
  it("should freeze a dependency even if it doesn't exist", function () {
    var f = Jpex.$freeze('bob');
    expect(f).toBeUndefined();
    expect(Jpex.$get('bob')).toBeUndefined();
  });
  it("should freeze a factory under a different name", function () {
    var f = Jpex.$freeze('factory', 'bob');
    expect(f).not.toBe(Jpex.$get('factory'));
    expect(f).toBe(Jpex.$get('bob'));
  });
  it("should accept named parameters", function () {
    Jpex.register.factory('factory', ['injected'], function (injected) {
      return injected;
    });
    var f = Jpex.$freeze('factory', {injected : 'fred'});
    expect(f).toBe('fred');
  });
});
