describe("$get", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should get a dependency", function () {
    var path = Jpex.$get('path');
    var realPath = require('path');
    expect(path).toBe(realPath);
  });
});
