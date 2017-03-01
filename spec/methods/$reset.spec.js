describe("$reset", function () {
  var Jpex, plugin, Child, beforeCalled, afterCalled, eventCalled;
  beforeEach(function () {
    Jpex=  require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);

    // Mocked factory
    Jpex.register.factory('factory', () => 'factory');
    Jpex.$set('factory', 'mocked');
    // Cached factory
    Jpex.register.factory('cached', () => ({})).lifecycle.application();
    Jpex.$resolve('cached');
    // children
    Child = Jpex.extend();
    // before/after invoke
    beforeCalled = 0;
    afterCalled = 0;
    Jpex.$beforeInvoke(() => beforeCalled++);
    Jpex.$afterInvoke(() => afterCalled++);
    // events
    eventCalled = 0;
    Jpex.$on('beforeCreate', () => eventCalled++);
    Jpex.$on('created', () => {});
    // recursion
    Child.register.constant('constant', 'constant');
    Child.$set('constant', 'mocked');
    // instances
    Jpex();

    expect(Jpex.$get('factory')).toBe('mocked');
    expect(Jpex.$$factories.cached.resolved).toBe(true);
    expect(Jpex.$children.length).toBe(1);
    expect(Jpex.$instances.length).toBe(1);
    expect(beforeCalled).toBe(1);
    expect(afterCalled).toBe(1);
    expect(eventCalled).toBe(1);
    expect(Child.$get('constant')).toBe('mocked');

    beforeCalled = 0;
    afterCalled = 0;
    eventCalled = 0;

    Jpex.$reset();
  });

  it("should remove mocked factories", function () {

    expect(Jpex.$get('factory')).toBe('factory');
  });
  it("should clear cached dependencies", function () {
    expect(Jpex.$$factories.cached.resolved).toBeFalsy();
  });
  it("should clear instances", function () {
    expect(Jpex.$instances.length).toBe(0);
  });
  it("should clear children", function () {
    expect(Jpex.$children.length).toBe(0);
  });
  it("should remove before/after invoke methods", function () {
    Jpex();
    expect(beforeCalled).toBe(0);
    expect(afterCalled).toBe(0);
  });
  it("should remove $on events", function () {
    Jpex();
    expect(eventCalled).toBe(0);
  });
  it("should loop through children", function () {
    expect(Child.$get('constant')).toBe('constant');
  });
});
