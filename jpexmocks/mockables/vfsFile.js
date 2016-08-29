module.exports = function(){
  var File = function(obj){
    obj = obj || {};
    var self = this;
    var contents;
    
    this.atime = obj.atime || new Date(); // accessed time
    this.ctime = obj.ctime || new Date(); // changed permissions time
    this.mtime = obj.mtime || new Date(); // modified time
    this.birthtime = obj.birthtime || new Date(); // created time
    this.folder = obj.folder || null;
    
    this.name = obj.name || '';
    this.encoding = obj.encoding || 'utf8';
    
    this.hasAccess = obj.hasAccess || true;
    
    Object.defineProperty(this, 'contents', {
      get : function(){
        self.atime = new Date();
        return contents;
      },
      set : function(val){
        self.mtime = new Date();
        contents = val;
      }
    });
    
    this.contents = obj.contents;
  };
  
  return File;
};