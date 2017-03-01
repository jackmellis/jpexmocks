describe("$descendants", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should have a $descendants property", function () {
    expect(Jpex.$descendants).toBeDefined();
    expect(Jpex.$descendants.length).toBe(0);
  });
  it("should add new children to the property", function () {
    var Class = Jpex.extend();
    var Class2 = Jpex.extend();

    expect(Jpex.$descendants.length).toBe(2);
    expect(Jpex.$descendants[0]).toBe(Class);
    expect(Jpex.$descendants[1]).toBe(Class2);
  });
  it("should add children of children", function () {
    var Class = Jpex.extend();
      var Class3 = Class.extend();
        var Class5 = Class3.extend();
    var Class2 = Jpex.extend();
      var Class4 = Class2.extend();

    expect(Jpex.$descendants.length).toBe(5);
    expect(Class.$descendants.length).toBe(2);
    expect(Class2.$descendants.length).toBe(1);
    expect(Class3.$descendants.length).toBe(1);
    expect(Class4.$descendants.length).toBe(0);
    expect(Class5.$descendants.length).toBe(0);
  });
  it("should not be mutatable", function () {
    var Class = Jpex.extend();

    var descendants = Jpex.$descendants;

    descendants.push({});

    expect(descendants.length).toBe(2);
    expect(Jpex.$descendants.length).toBe(1);
  });
});
