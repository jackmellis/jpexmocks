/* globals describe, expect, it, beforeEach, afterEach ,spyOn*/

var grequire = require('./grequire');

describe('Base Class - Mock - File System', function(){
  var Base, Mock, $fs;
  
  beforeEach(function(){
    Base = grequire('node_modules/jpex');
    Mock = grequire('.');
    Mock(Base);
    $fs = Base.mock.get('$fs');
    $fs.use({
      'ant/bear/cat' : 'file1.js',
      'ant/bat/croc' : 'file2.js'
    });
  });
  
  it('should use a file system', function(){
    expect(typeof $fs.use).toBe('function');
  });
  
  it('should have callbackable functions from fs', function(){
    expect($fs.write).toBeDefined();
    expect(typeof $fs.stat).toBe('function');
  });
  
  it('should work as a promise', function(){
    var result;
    
    $fs.readdir('./ant')
      .then(function(arr){
        result = arr;
      });
    
    $fs.flush();
    
      expect(result.length).toBe(2);
      expect(result.indexOf('bear')).toBeGreaterThan(-1);
      expect(result.indexOf('bat')).toBeGreaterThan(-1);
  });
  
  it('should catch errors', function(){
    var e;
    
    $fs.readdir('./doesnot/exist')
      .catch(function(err){
        e = err;
      });
    
    $fs.flush();
    
    expect(e).toBeDefined();
  });
  
  it('should have non-callback method', function(){
    expect($fs.createReadStream).toBeDefined();
  });
});