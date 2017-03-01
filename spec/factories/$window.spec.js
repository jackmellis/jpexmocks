describe("$window / $document", function () {
  var Jpex, plugin, $window, $document;
  beforeEach(function () {
    Jpex = require('jpex').extend();
    plugin = require('../../src');
    Jpex.use(plugin);
    $window = Jpex.$get('$window');
    $document = Jpex.$get('$document');
  });
  it("should return an injectable object", function () {
    expect($window).toBeDefined();
    expect($document).toBeDefined();
    expect($window.document).toBe($document);
  });
});
