describe("$log", function () {
  var Jpex, plugin, $log;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    $log = Jpex.$get('$log');
  });
  it("should not call the console", function () {
    spyOn(console, 'log');
    $log('message');
    expect(console.log).not.toHaveBeenCalled();
  });
  it("should track messages", function () {
    var expected = ['a', 'b', 'c', 'd'];
    $log('a');
    $log.log('b');
    $log.warn('c');
    $log.error('d');
    expect($log.messages).toEqual(expected);
  });
});
