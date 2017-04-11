var Jpex, Master, Mock, constructor, $promise, plugin;

// beforeEach(function(){
  Jpex = require('jpex').extend();
  plugin = require('./src');
  Jpex.use(plugin);
  Master = Jpex.extend(function($promise){
    constructor($promise);
  });
  constructor = function(){};

  $promise = Master.$get('$promise');
// });

debugger;

// var spy = jasmine.createSpy();
var p = $promise(function (resolve) {
  return $promise.resolve().then(function () {
    return Promise.resolve().then(function () {
      resolve();
    });
  });
})
.then(function () {
  // spy();
  console.log('tada');
})
.catch(err => console.log(err));

$promise.flush();

// expect(spy).not.toHaveBeenCalled();
console.log('before timeout');

setTimeout(function () {
  // expect(spy).not.toHaveBeenCalled();
  console.log('first timeout');
  $promise.flush();
  setTimeout(function () {
    console.log('second timeout');
    // expect(spy).toHaveBeenCalled();
    // done();

  }, 5);
}, 5);
