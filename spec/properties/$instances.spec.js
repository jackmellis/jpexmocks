describe("$instances", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });
  it("should have an $instances property", function () {
    expect(Jpex.$instances).toBeDefined();
    expect(Jpex.$instances.length).toBe(0);
  });
  it("should add a new instance to the property", function () {
    Jpex();
    expect(Jpex.$instances.length).toBe(1);
    Jpex();
    expect(Jpex.$instances.length).toBe(2);
  });
  it("should not add indirect instances", function () {
    var Class = Jpex.extend();

    Jpex();
    expect(Jpex.$instances.length).toBe(1);
    expect(Class.$instances.length).toBe(0);
    Class();
    expect(Jpex.$instances.length).toBe(1);
    expect(Class.$instances.length).toBe(1);
  });
  it("should not be mutatable", function () {
    Jpex();
    var instances = Jpex.$instances;
    instances.push({});

    expect(instances.length).toBe(2);
    expect(Jpex.$instances.length).toBe(1);
  });
});
