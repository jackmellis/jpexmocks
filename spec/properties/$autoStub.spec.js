describe("$autoStub", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);

    Jpex.register.factory('factory', function () {
      function result() {
        throw new Error();
      }
      result.method = function () {
        throw new Error();
      };
      return result;
    });
    Jpex.register.service('service', function () {
      this.method = function () {
        throw new Error();
      }
    });

    expect(() => Jpex.$get('factory')()).toThrow();
    expect(() => Jpex.$get('service').method()).toThrow();

    Jpex.$autoStub = true;
  });

  it("should automatically stub all dependencies", function () {
    var f = Jpex.$get('factory');
    expect(() => f()).not.toThrow();
    expect(() => f.method()).not.toThrow();
  });

  it("should not stub mock factories created with $set", function () {
    Jpex.$set('factory', function () {
      return function () {
        throw new Error();
      };
    });

    var f = Jpex.$get('factory');
    expect(() => f()).toThrow();
  });

  it("should not stub excluded factories", function () {
    Jpex.$autoStub = {
      exclude : ['service']
    };

    expect(() => Jpex.$get('factory')()).not.toThrow();
    expect(() => Jpex.$get('service').method()).toThrow();
  });

  it("should not stub non-included factories", function () {
    Jpex.$autoStub = {
      include : ['service']
    };

    expect(() => Jpex.$get('factory')()).toThrow();
    expect(() => Jpex.$get('service').method()).not.toThrow();
  });

  it("should not stub if autoStub is disabled", function () {
    Jpex.$autoStub = false;

    expect(() => Jpex.$get('factory')()).toThrow();
    expect(() => Jpex.$get('service').method()).toThrow();
  });

  it("should inherit", function () {
    var Class = Jpex.extend();
    Class.register.factory('factory', function () {
      return function () {
        throw new Error();
      }
    });

    expect(() => Jpex.$get('factory')()).not.toThrow();
  });

  it("should stub node modules", function () {
    var path = Jpex.$get('path');
    path.dirname();
    expect(path.dirname).toHaveBeenCalled();
  });
});
