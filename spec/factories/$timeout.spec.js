describe("$timeout", function () {
  var Jpex, plugin, $timeout;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    $timeout = Jpex.$get('$timeout');
  });

  it("should not set a real timeout", function (done) {
    var spy = jasmine.createSpy();
    $timeout(spy, 10);

    setTimeout(function () {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 100);
  });
  it("should flush a timeout", function () {
    var spy = jasmine.createSpy();
    $timeout(spy, 10);
    $timeout.flush();
    expect(spy).toHaveBeenCalled();
  });
  it("should clear a timeout", function () {
    var spy = jasmine.createSpy();
    var i = $timeout(spy, 10);
    $timeout.clear(i);
    $timeout.flush();
    expect(spy).not.toHaveBeenCalled();
  });
  it("should flush multiple timeouts", function () {
    var spy = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    $timeout(spy, 10);
    $timeout(spy2, 20);
    $timeout.flush();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it("should count the number of outstanding items", function () {
    $timeout(() => {}, 10);
    $timeout(() => {}, 10);
    expect($timeout.count()).toBe(2);
  });
  it("should not flush timeouts that haven't elapsed yet", function () {
    $timeout.flush(900);
    var spy = jasmine.createSpy();
    $timeout(spy, 1000);
    $timeout.flush(800);
    expect(spy).not.toHaveBeenCalled();
    $timeout.flush(100);
    expect(spy).not.toHaveBeenCalled();
    $timeout.flush(100);
    expect(spy).toHaveBeenCalled();
  });
});
