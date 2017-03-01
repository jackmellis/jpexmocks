describe("$immediate", function () {
  var Jpex, plugin, $immediate;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    $immediate = Jpex.$get('$immediate');
  });

  it("should not set a real immediate", function (done) {
    var spy = jasmine.createSpy();
    $immediate(spy);

    setTimeout(function () {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 100);
  });
  it("should flush an immediate", function () {
    var spy = jasmine.createSpy();
    $immediate(spy);
    $immediate.flush();
    expect(spy).toHaveBeenCalled();
  });
  it("should clear an immediate", function () {
    var spy = jasmine.createSpy();
    var i = $immediate(spy);
    $immediate.clear(i);
    $immediate.flush();
    expect(spy).not.toHaveBeenCalled();
  });
  it("should flush multiple immediates", function () {
    var spy = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    $immediate(spy);
    $immediate(spy2);
    $immediate.flush();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it("should count the number of outstanding items", function () {
    $immediate(() => {}, 10);
    $immediate(() => {}, 10);
    expect($immediate.count()).toBe(2);
  });
});
