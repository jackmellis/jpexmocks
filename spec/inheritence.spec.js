var grequire = require ('./grequire');

describe('Inheritence', function(){
  var Mock, jpex;
  beforeEach(function(){
    jpex = grequire('node_modules/jpex');
    Mock = grequire('.');
  });
  afterEach(function(){
    jpex.mock.reset(true);
  });
  
  it('should extend from the base class', function(){
    Mock();
    
    var test = jpex.extend();
    expect(test._mock.extend).toBeDefined();
    
    var test2 = test.extend();
    expect(test2._mock.extend).toBeDefined();
  });
});