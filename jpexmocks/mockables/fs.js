module.exports = function(path, $promise, $vfs, $vfsFolder, $vfsFile){
  var Path = path;
  var virtualFileSystem = $vfs();
  var promises = [];
  var notSupported = function(){
    return function(){
      throw new Error('Not supported');
    };
  };
  var doNothing = function(){
    return () => (track(resolve => resolve()));
  };
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
  var validateFolder = function(folder){
    if (!folder){
      throw new Error('Folder not found');
    }else if (!folder instanceof $vfsFolder){
      throw new Error('Folder not found');
    }
  };
  
  var $fs = {
    use : function(obj){
      virtualFileSystem.add(obj);
    },
    
    // Regular IO functions
    readFile : function(path){
      return track(function(resolve){
        var file = virtualFileSystem.find(path);
        validateFile(file);
        
        resolve(file.contents);
      });
    },
    
    writeFile : function(path, data){
      return track(function(resolve){
        var fileName = Path.basename(path);
        var folderName = Path.dirname(path);
        var folder = virtualFileSystem.find(folderName);
        validateFolder(folder);

        var file = new $vfsFile({name : fileName, contents : data});
        folder.add(file);

        resolve();
      });
    },
    
    readdir : function(path){
      return track(function(resolve){
        var folder = virtualFileSystem.find(path);
        validateFolder(folder);
        
        resolve(Object.keys(folder.files).map(f => folder.files[f].name));
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
    
    appendFile : function(path, data){
      return track(function(resolve){
        var folders = Path.dirname(path);
        var fileName = Path.basename(path);

        var file = virtualFileSystem.find(path);
        if (!file){
          var folder = virtualFileSystem.find(folders);
          validateFolder(folder);

          file = new $vfsFile({name : fileName, contents : ''});
          folder.add(file);
        }

        file.contents += data;
        
        resolve();
      });
    },
    
    mkdir : function(path){
      return track(function(resolve, reject){
        var folder = Path.basename(path);
        var folders = Path.dirname(path);
        
        var parentFolder = virtualFileSystem.find(folders);
        validateFolder(parentFolder);
        
        if (parentFolder.find(folder)){
          return reject(new Error('Folder already exists'));
        }
        
        var folderObj = {};
        folderObj[folder] = {};
        
        parentFolder.add(folderObj);
        
        resolve();
      });
    },
    mkdtemp : function(path){
      var arr = 'abcdefghijklmnopqrstuvwxyz'.split('');
      var newName = (new Array(6)).map(() => arr[Math.floor(Math.random() * 26)]);
      return $fs.mkdir(path + newName);
    },
    
    realpath : function(path){
      return track(function(resolve){
        var realpath = Path.normalize(path);
        resolve(realpath);
      });
    },
    
    rename : function(oldPath, newPath){
      return track(function(resolve){
        var file = virtualFileSystem.find(oldPath);
        var targetFolderName = Path.dirname(newPath);
        var targetFileName = Path.basename(newPath);
        var targetFolder = virtualFileSystem.find(targetFolderName);
        if (!targetFolder || !targetFolder instanceof $vfsFolder){
          throw new Error('Could not find target folder ' + targetFolderName);
        }
        
        if (!file){
          throw new Error('file not fouund');
        }
        
        var sourceFolder = file.folder;
        
        // move a file to another file
        // move a folder to a folder
        if (file instanceof $vfsFile){
          delete sourceFolder.files[file.name];
          targetFolder.files[targetFileName] = file;
          file.name = targetFileName;
          file.folder = targetFolder;
        }else if (file instanceof $vfsFolder){
          delete sourceFolder.folders[file.name];
          targetFolder.folders[targetFileName] = file;
          file.name = targetFileName;
          file.folder = targetFolder;
        }
        
        resolve();
      });
    },
    
    rmdir : function(path){
      return track(function(resolve){
        var folder = virtualFileSystem.find(path);
        validateFolder(folder);
        
        if (Object.keys(folder.files).length || Object.keys(folder.folders).length){
          throw new Error('Cannot remove an empty folder');
        }
        
        var parentFolder = folder.folder;
        delete parentFolder.folders[folder.name];
        resolve();
      });
    },
    
    unlink : function(path){
      return track(function(resolve){
        var file = virtualFileSystem.find(path);
        if (!file){
          throw new Error('No such file or directory ', + path);
        }
        delete file.folder.folders[file.name];
        resolve();
      });
    },
    
    symlink : notSupported(),
    
    stats : notSupported(),
    
    utimes : function(path, atime, mtime){
      return track(function(resolve){
        var file = virtualFileSystem.find(path);
        if (!atime instanceof Date){
          atime = isNaN(atime) ? Date.now() : new Date(atime);
        }
        if (!mtime instanceof Date){
          mtime = isNaN(mtime) ? Date.now() : new Date(mtime);
        }
        
        file.atime = atime;
        file.mtime = mtime;
        
        resolve();
      });
    },
    
    chmod : doNothing(),
    chown : doNothing(),
    link : doNothing(),
    readlink : notSupported(),
    lchown : doNothing(),
    truncate : doNothing(),
    
    // File Descriptor stuff
    read : notSupported(),
    write : notSupported(),
    fdchmod : doNothing(),
    fchown : doNothing(),
    fdatasync : doNothing(),
    fsync : doNothing(),
    ftruncate : notSupported(),
    futimes : notSupported(),
    
    // Stream stuff
    close : notSupported(),
    createReadStream : notSupported(),
    createWriteStream : notSupported(),
    open : notSupported(),
    
    // watchers
    watch : doNothing(),
    watchFile : doNothing(),
    unwatchFile : doNothing(),
    
    
    flush : function(){
      promises.forEach(function(p){
        p.flush();
      });
    }
  };
  
  return $fs;
};