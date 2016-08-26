module.exports = function($promise, vfs, vfsFolder, vfsFile){
  var virtualFileSystem;
  var fs = {
    use : function(obj){
      virtualFileSystem = vfs(obj);
    },
    
    readFile : function(path){
      return $promise(function(resolve, reject){
        var file = virtualFileSystem.find(path);
        if (!file){
          return reject(new Error('File not found'));
        }else if (file instanceof vsFolder){
          return reject(new Error('invalid read operation on folder'));
        }else if (!file instanceof vsFile){
          
        }
        if (!file || !file instanceof vfsFile){
          
        }
      });
    }
  };
  
  return vfs;
};