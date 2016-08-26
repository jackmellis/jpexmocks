var vfs = require('./mockables/vfs')();
var folders = vfs({
  home : {
    'apple/banana/carrot' : 'obviously im a carrot',
    'apple/bettroot/cava' : 'i might overwrite mr carrot',
    bin : {
      'app.exe' : vfs.file(),
      'readme.txt' : 'please read me',
      debug : {
        'log.info' : 'log information'
      }
    },
    lib : {
      'a/b/c' : {
        file1 : 'file one'
      },
      'd/e/f/file2' : 'file two'
    }
  }
});
console.log(JSON.stringify(folders));

console.log(folders.find('home/bin/readme.txt'));