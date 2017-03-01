describe("$unset", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);

    Jpex.register.factory('factory', [], () => 'factory');
    Jpex.register.constant('constant', 'constant');
    Jpex.$set('factory', 'mocked');
    Jpex.$set('constant', 'mocked');

    expect(Jpex.$get('factory')).toBe('mocked');
    expect(Jpex.$get('constant')).toBe('mocked');
  });

  it("should unset a mocked factory", function () {
    Jpex.$unset();
    expect(Jpex.$get('factory')).toBe('factory');
    expect(Jpex.$get('constant')).toBe('constant');
  });
  it("should only unset a specific factory", function () {
    Jpex.$unset('factory');
    expect(Jpex.$get('factory')).toBe('factory');
    expect(Jpex.$get('constant')).toBe('mocked');
  });
  it("should not unset real factories", function () {
    Jpex.$unset();
    Jpex.$unset();
    expect(Jpex.$get('factory')).toBe('factory');
    expect(Jpex.$get('constant')).toBe('constant');
  });
  it("should not unset inherited factories", function () {
    var Class = Jpex.extend();
    Class.register.service('service', function(){
      this.test = 'service';
    });
    Class.$set('service', () => ({ test : 'mocked'}));

    expect(Class.$get('factory')).toBe('mocked');
    expect(Class.$get('constant')).toBe('mocked');
    expect(Class.$get('service').test).toBe('mocked');

    Class.$unset();

    expect(Class.$get('factory')).toBe('mocked');
    expect(Class.$get('constant')).toBe('mocked');
    expect(Class.$get('service').test).toBe('service');
  });

  it("should unset inherited factories", function () {
    var Class = Jpex.extend();
    Class.register.service('service', function(){
      this.test = 'service';
    });
    Class.$set('service', () => ({ test : 'mocked'}));

    expect(Class.$get('factory')).toBe('mocked');
    expect(Class.$get('constant')).toBe('mocked');
    expect(Class.$get('service').test).toBe('mocked');
    Class.$unset(null, true);

    expect(Class.$get('factory')).toBe('factory');
    expect(Class.$get('constant')).toBe('constant');
    expect(Class.$get('service').test).toBe('service');
  });
  it("should unset child factories", function () {
    var Class = Jpex.extend();
    Class.register.service('service', function(){
      this.test = 'service';
    });
    Class.$set('service', () => ({ test : 'mocked'}));

    expect(Class.$get('factory')).toBe('mocked');
    expect(Class.$get('constant')).toBe('mocked');
    expect(Class.$get('service').test).toBe('mocked');

    Jpex.$unset(null, false, true);

    expect(Class.$get('factory')).toBe('factory');
    expect(Class.$get('constant')).toBe('constant');
    expect(Class.$get('service').test).toBe('service');
  });
  it("should unset parent and child factories", function () {
    var Middle = Jpex.extend();
    Middle.register.service('service', function(){
      this.test = 'service';
    });
    Middle.$set('service', () => ({ test : 'mocked'}));

    var Child = Middle.extend();
    Child.$set('constant', 'child-constant');

    expect(Jpex.$get('factory')).toBe('mocked');
    expect(Jpex.$get('constant')).toBe('mocked');

    expect(Middle.$get('factory')).toBe('mocked');
    expect(Middle.$get('constant')).toBe('mocked');
    expect(Middle.$get('service').test).toBe('mocked');

    expect(Child.$get('factory')).toBe('mocked');
    expect(Child.$get('constant')).toBe('child-constant');
    expect(Child.$get('service').test).toBe('mocked');

    Middle.$unset(null, true, true);

    expect(Jpex.$get('factory')).toBe('factory');
    expect(Jpex.$get('constant')).toBe('constant');

    expect(Middle.$get('factory')).toBe('factory');
    expect(Middle.$get('constant')).toBe('constant');
    expect(Middle.$get('service').test).toBe('service');

    expect(Child.$get('factory')).toBe('factory');
    expect(Child.$get('constant')).toBe('constant');
    expect(Child.$get('service').test).toBe('service');
  });
});
