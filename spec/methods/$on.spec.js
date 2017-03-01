describe("$on", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex=  require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should add an event listener", function () {
    var spy = jasmine.createSpy();
    Jpex.$on('created', spy);

    Jpex();

    expect(spy).toHaveBeenCalled();
  });
});
