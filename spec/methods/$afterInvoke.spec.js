describe("$afterInvoke", function () {
  var Jpex, plugin;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
  });

  it("should error if no function provided", function () {
    expect(() => Jpex.$afterInvoke = 'asb').toThrow();
  });
  it("should call a function before invoking", function () {
    var order = [];
    var spy1 = jasmine.createSpy().and.callFake(() => order.push(1));
    var spy2 = jasmine.createSpy().and.callFake(() => order.push(2));
    var Class = Jpex.extend(spy1);
    Class.$afterInvoke = spy2;

    Class();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(order).toEqual([1, 2]);
  });
  it("should pass in the class's dependencies", function () {
    var spy = jasmine.createSpy();
    var path = require('path');
    var Class = Jpex.extend({dependencies : 'path'});
    Class.$afterInvoke = spy;
    Class();

    expect(spy).toHaveBeenCalledWith(path);
  });
  it("should have the instance context", function () {
    var calledWith = {};
    Jpex.$afterInvoke = function () {
      calledWith = this;
    };
    Jpex();

    expect(calledWith).toBe(Jpex.$instances[0]);
  });
  it("should not fire on child classes", function () {
    var called = false;
    Jpex.$afterInvoke = () => called = true;
    var Class = Jpex.extend();

    Class();
    expect(called).toBe(false);
    Jpex();
    expect(called).toBe(true);
  });
});
