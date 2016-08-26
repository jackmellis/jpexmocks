var vfsFile = require('./mockables/vfsFile')();
var vfsFolder = require('./mockables/vfsFolder')(vfsFile);
var vfs = require('./mockables/vfs')(vfsFolder, vfsFile);
var $promise = require('./mockables/promise')();
var $fs = require('./mockables/fs')($promise, vfs, vfsFolder, vfsFile);

var appFolder = vfs.folder({
  name : 'app'
});
var binFolder = vfs.folder({
  name : 'bin'
});
var appFile = vfs.file({
  name : 'app.js',
  contents : 'my application'
});
appFolder.add(binFolder);
binFolder.add(appFile);
$fs.use(appFolder);

//$fs.use({
//  app : {
//    bin : {
//      'app.js' : 'my application'
//    }
//  }
//});
$fs.readFile('app/bin/app.js')
.then(function(result){
  console.log(result);
});
$fs.flush();