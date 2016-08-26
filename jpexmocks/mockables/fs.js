module.exports = function($promise, $vfs, $vfsFolder, $vfsFile){
  var virtualFileSystem = $vfs();
  var promises = [];
  var track = function(fn){
    var p = $promise(fn);
    promises.push(p);
    return p;
  };
  var validateFile = function(file){
    if (!file){
      throw new Error('File not found');
    }else if (file instanceof $vfsFolder){
      throw new Error('invalid read operation on folder');
    }else if (!file instanceof $vfsFile){
      throw new Error('File not found');
    }
  };
  
  var $fs = {
    use : function(obj){
      virtualFileSystem.add(obj);
    },
    
    readFile : function(path){
      return track(function(resolve){
        var file = virtualFileSystem.find(path);
        validateFile(file);
        
        resolve(file.contents);
      });
    },
    
    access : function(path){
      return track(function(resolve, reject){
        var file = virtualFileSystem.find(path);
        validateFile(file);
        
        if (file.hasAccess){
          resolve();
        }else{
          reject();
        }
      });
    },
    
    flush : function(){
      promises.forEach(function(p){
        p.flush();
      });
    }
  };
  
  return $fs;
};