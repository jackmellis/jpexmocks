module.exports = function(){
  var File = function(obj){
    obj = obj || {};
    this.name = obj.name || '';
    this.contents = obj.contents;
    this.encoding = obj.encoding || 'utf8';
  };
  
  return File;
};