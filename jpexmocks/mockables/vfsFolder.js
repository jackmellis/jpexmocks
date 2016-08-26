module.exports = function(vfsFile){
  var Folder = function(obj){
    this.name = '';
    this.folders = {};
    this.files = {};
    
    this.add(obj);
  };
  Folder.prototype.add = function(obj){
    var self = this;
    
    Object.keys(obj).forEach(function(name){
      var value = obj[name];
      
      // For elements like a/b/c
      var nameFolders = name.split('/');
      if (nameFolders.length > 1){
        var n = nameFolders.shift();
        var newFolder = {};
        newFolder[nameFolders.join('/')] = value;
        if (self.folders[n]){
          self.folders[n].add(newFolder);
        }else{
          self.folders[n] = new Folder(newFolder);
          self.folders[n].name = n;
        }
        return;
      }
      
      // Work out what the value is
      if (value instanceof Folder){
        // already a folder
        self.folders[name] = value;
        self.folders[name].name = name;
      }else if (value instanceof vfsFile){
        // already a file
        self.files[name] = value;
        self.files[name].name = name;
      }else if (typeof value === 'string'){
        // assume it's a text file
        var fileObj = {name : name, contents : value, encoding : 'utf8'};
        self.files[name] = new vfsFile(fileObj);
      }else if (value && typeof value === 'object'){
        // new folder
        self.folders[name] = new Folder(value);
        self.folders[name].name = name;
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
  
  return Folder;
};