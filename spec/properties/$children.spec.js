describe("$children", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should have a $children property", function () {
    expect(Jpex.$children).toBeDefined();
    expect(Jpex.$children.length).toBe(0);
  });
  it("should add new children to the property", function () {
    var Class = Jpex.extend();
    var Class2 = Jpex.extend();

    expect(Jpex.$children.length).toBe(2);
    expect(Jpex.$children[0]).toBe(Class);
    expect(Jpex.$children[1]).toBe(Class2);
  });
  it("should only add direct children", function () {
    var Class = Jpex.extend();
    var Class2 = Class.extend();

    expect(Jpex.$children.length).toBe(1);
    expect(Jpex.$children[0]).toBe(Class);
    expect(Class.$children[0]).toBe(Class2);
  });
  it("should not be mutatable", function () {
    var Class = Jpex.extend();

    var children = Jpex.$children;

    children.push({});

    expect(children.length).toBe(2);
    expect(Jpex.$children.length).toBe(1);
  });
});
