module.exports = function($vfsFolder, $vfsFile){
  // Virtual File System
  
  var vfs = function(obj){
    if (obj instanceof $vfsFolder){
      return obj;
    }else if (obj instanceof $vfsFile){
      var newObj = {};
      newObj[obj.name] = obj;
      return $vfsFolder.quick(newObj);
    }else{
      return $vfsFolder.quick(obj);
    }
  };
  vfs.folder = function(obj){
    return new $vfsFolder(obj);
  };
  vfs.file = function(obj){
    return new $vfsFile(obj);
  };
  
  return vfs;
};