describe("$tick", function () {
  var Jpex, plugin, $tick;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    $tick = Jpex.$get('$tick');
  });

  it("should not set a real tick", function (done) {
    var spy = jasmine.createSpy();
    $tick(spy);

    setTimeout(function () {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 100);
  });
  it("should flush an tick", function () {
    var spy = jasmine.createSpy();
    $tick(spy);
    $tick.flush();
    expect(spy).toHaveBeenCalled();
  });
  it("should clear an tick", function () {
    var spy = jasmine.createSpy();
    var i = $tick(spy);
    $tick.clear(i);
    $tick.flush();
    expect(spy).not.toHaveBeenCalled();
  });
  it("should flush multiple ticks", function () {
    var spy = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    $tick(spy);
    $tick(spy2);
    $tick.flush();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it("should count the number of outstanding items", function () {
    $tick(() => {}, 10);
    $tick(() => {}, 10);
    expect($tick.count()).toBe(2);
  });
});
