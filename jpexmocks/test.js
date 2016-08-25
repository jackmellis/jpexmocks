var jpex = require('jpex');
var Mock = require('.');
var mock = Mock(jpex);
var $fs = mock.get('$fs');

$fs.access('some path', {option : true}).then(r => console.log(r));
$fs.access.when('some path', {option : true}, true);
$fs.flush();