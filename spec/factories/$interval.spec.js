describe("$interval", function () {
  var Jpex, plugin, $interval;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    $interval = Jpex.$get('$interval');
  });

  it("should not set a real interval", function (done) {
    var spy = jasmine.createSpy();
    $interval(spy, 10);

    setTimeout(function () {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 100);
  });
  it("should flush an interval", function () {
    var spy = jasmine.createSpy();
    $interval(spy, 10);
    $interval.flush();
    $interval.flush();
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.count()).toBe(2);
  });
  it("should clear an interval", function () {
    var spy = jasmine.createSpy();
    var i = $interval(spy, 10);
    $interval.clear(i);
    $interval.flush();
    expect(spy).not.toHaveBeenCalled();
  });
  it("should flush multiple intervals", function () {
    var spy = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    $interval(spy, 10);
    $interval(spy2, 20);
    $interval.flush();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it("should count the number of outstanding items", function () {
    $interval(() => {}, 10);
    $interval(() => {}, 10);
    expect($interval.count()).toBe(2);
  });
  it("should not flush intervals that haven't elapsed yet", function () {
    $interval.flush(900);
    var spy = jasmine.createSpy();
    $interval(spy, 1000);
    $interval.flush(800);
    expect(spy).not.toHaveBeenCalled();
    $interval.flush(100);
    expect(spy).not.toHaveBeenCalled();
    $interval.flush(100);
    expect(spy).toHaveBeenCalled();
  });
});
