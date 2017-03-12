describe("$stub and $stubFn", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should stub out a service", function () {
    Jpex.register.service('service', function () {
      this.foo = function () {
        throw new Error();
      };
      this.bah = function () {
        throw new Error();
      };
    });

    var service = Jpex.$get('service');
    expect(() => service.foo()).toThrow();
    expect(() => service.bah()).toThrow();

    service = Jpex.$stub('service');
    expect(() => service.foo()).not.toThrow();
    expect(() => service.bah()).not.toThrow();

    expect(service.foo).toHaveBeenCalled(); // should already be a spy
  });
  it("should stub prototyped and inherited methods", function () {
    function Service(){
      this.methodA = function () {
        throw new Error();
      };
    }
    Service.prototype.methodB = function () {
      throw new Error();
    };
    Jpex.register.service('service', Service);

    var service = Jpex.$get('service');
    expect(Object.hasOwnProperty.call(service, 'methodA')).toBe(true);
    expect(Object.hasOwnProperty.call(service, 'methodB')).toBe(false);
    expect(() => service.methodA()).toThrow();
    expect(() => service.methodB()).toThrow();

    service = Jpex.$stub('service');
    expect(Object.hasOwnProperty.call(service, 'methodA')).toBe(true);
    expect(Object.hasOwnProperty.call(service, 'methodB')).toBe(true);
    expect(() => service.methodA()).not.toThrow();
    expect(() => service.methodB()).not.toThrow();

    expect(service.methodA).toHaveBeenCalled();
    expect(service.methodB).toHaveBeenCalled();
  });
  it("should create an empty object if the factory doesnt exist", function () {
    var service = Jpex.$stub('service');
    expect(service).toEqual({});
    expect(Jpex.$get('service')).toBe(service);
  });
  it("should stub a function", function () {
    Jpex.register.factory('factory', function () {
      function fn() {
        throw new Error();
      };
      fn.method = function () {
        throw new Error();
      };
      return fn;
    });

    var f = Jpex.$get('factory');
    expect(() => f()).toThrow();
    expect(() => f.method()).toThrow();

    f = Jpex.$stub('factory');
    expect(() => f()).not.toThrow();
    expect(() => f.method()).not.toThrow();
  });
  it("should overwrite the default stub function", function () {
    var called = 0;
    Jpex.$stubFn = function () {
      return () => called++;
    }
    Jpex.register.factory('factory', function () {
      return function(){};
    });

    Jpex.$get('factory')();
    expect(called).toBe(0);

    Jpex.$stub('factory')();
    expect(called).toBe(1);

    expect(Jpex.$stub('factory').and).toBeUndefined();
  });
  it("should error if stubFn is not a function", function () {
    expect(() => Jpex.$stubFn = null).not.toThrow();
    expect(() => Jpex.$stubFn = 7).toThrow();
  });
  it("should inherit stub functions", function () {
    var calledBy = null;
    Jpex.register.factory('factory', function () {
      return function(){};
    });
    var Class = Jpex.extend();

    Jpex.$stubFn = function () {
      return () => calledBy = 'Jpex';
    };
    Class.$stubFn = function () {
      return () => calledBy = 'Class';
    };

    Jpex.$get('factory')();
    expect(calledBy).toBe(null);

    Jpex.$stub('factory')();
    expect(calledBy).toBe('Jpex');

    Class.$stub('factory')();
    expect(calledBy).toBe('Class');

    Jpex.$stub('factory')();
    expect(calledBy).toBe('Jpex');
  });
});
