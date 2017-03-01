describe("$inject", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should accept a callback function", function (done) {
    Jpex.$inject(function () {
      done();
    });
  });
  it("should inject arguments", function (done) {
    Jpex.$inject(['path', 'fs'], function (path, fs) {
      expect(path).toBe(require('path'));
      expect(fs).toBe(require('fs'));
      done();
    });
  });
  it("should extract arguments from the function", function (done) {
    Jpex.$inject(function (path, fs) {
      expect(path).toBe(require('path'));
      expect(fs).toBe(require('fs'));
      done();
    });
  });
  it("should use $set to overwrite dependencies", function () {
    Jpex.$inject(function () {
      return {
        foo : () => 'bah'
      };
    });

    expect(Jpex.$get('foo')).toBe('bah');
  });
  it("should not overwrite dependencies not passed back", function () {
    Jpex.register.constant('foo', 'bah');
    Jpex.$inject(function (foo) {
      expect(foo).toBe('bah');
      return {
        zoo : 'doo'
      };
    });

    expect(Jpex.$get('foo')).toBe('bah');
  });
});
