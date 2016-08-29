var vfsFile = require('./mockables/vfsFile')();
var vfsFolder = require('./mockables/vfsFolder')(vfsFile);
var vfs = require('./mockables/vfs')(vfsFolder, vfsFile);
var $promise = require('./mockables/promise')();
var $fs = require('./mockables/fs')(require('path'), $promise, vfs, vfsFolder, vfsFile);

//var appFolder = vfs.folder({
//  name : 'app'
//});
//var binFolder = vfs.folder({
//  name : 'bin'
//});
//var appFile = vfs.file({
//  name : 'app.js',
//  contents : 'my application'
//});
//appFolder.add(binFolder);
//binFolder.add(appFile);
//$fs.use(appFolder);

//$fs.use({
//  app : {
//    bin : {
//      'app.js' : 'my application'
//    }
//  }
//});

$fs.use({
  'app/bin/app.js' : 'my application'
});
$fs.use({'app/bin/sub.js' : 'my sub file'});


$fs.rename('app/bin/app.js', 'app/bin/fluh.js');
$fs.rename('app/bin', 'app/flin');
$fs.flush();