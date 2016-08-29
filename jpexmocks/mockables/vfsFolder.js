module.exports = function($vfsFile){
  var Folder = function(obj){
    obj = obj || {};
    obj.contents = obj.contents || {};
    this.name = obj.name || '';
    this.folder = obj.folder || null;
    
    this.folders = {};
    this.files = {};
    
    this.atime = obj.atime || new Date(); // accessed time
    this.ctime = obj.ctime || new Date(); // changed permissions time
    this.mtime = obj.mtime || new Date(); // modified time
    this.birthtime = obj.birthtime || new Date(); // created time
    
    this.add(obj.contents);
  };
  Folder.prototype.add = function(obj){
    var self = this;
    
    if (obj instanceof $vfsFile || obj instanceof Folder){
      if (!obj.name){
        return;
      }
      
      var n = obj.name;
      var o = obj;
      obj = {};
      obj[n] = o;
    }
    
    Object.keys(obj).forEach(function(name){
      var value = obj[name];
      var fileObj;
      
      // For elements like a/b/c
      var nameFolders = name.split('/');
      if (nameFolders.length > 1){
        var n = nameFolders.shift();
        var newFolder = {};
        newFolder[nameFolders.join('/')] = value;
        if (self.folders[n]){
          self.folders[n].add(newFolder);
        }else{
          self.folders[n] = Folder.quick(newFolder);
          self.folders[n].name = n;
          self.folders[n].folder = self;
        }
        return;
      }
      
      // Work out what the value is
      if (value instanceof Folder){
        // already a folder
        self.folders[name] = value;
        self.folders[name].name = name;
        self.folders[name].folder = self;
      }else if (value instanceof $vfsFile){
        // already a file
        self.files[name] = value;
        self.files[name].name = name;
        self.files[name].folder = self;
      }else if (typeof value === 'string'){
        // assume it's a text file
        fileObj = {name : name, contents : value, encoding : 'utf8', folder : self};
        self.files[name] = new $vfsFile(fileObj);
      }else if (value instanceof Buffer){
        fileObj = {name : name, contents : value, encoding : 'binary', folder : self};
        self.files[name] = new $vfsFile(fileObj);
      }else if (value && typeof value === 'object'){
        // new folder
        self.folders[name] = Folder.quick(value);
        self.folders[name].name = name;
        self.folders[name].folder = self;
      }else{
        // not sure what it is!
      }
    });
  };
  Folder.prototype.find = function(path){
    path = path.split('/');
    var found = this;
    while (path.length && found){
      var p = path.shift();
      if (!path.length){
        found = found.files[p] || found.folders[p];
      }else{
        found = found.folders[p];
      }
    }
    return found;
  };
  
  Folder.quick = function(obj){
    return new Folder({contents : obj});
  };
  
  return Folder;
};