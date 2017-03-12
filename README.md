Jpex Mocks
===========
Mocking Library for Jpex
------------------------
[![Build Status](https://travis-ci.org/jackmellis/jpexmocks.svg?branch=master)](https://travis-ci.org/jackmellis/jpexmocks)
[![npm version](https://badge.fury.io/js/jpexmocks.svg)](https://badge.fury.io/js/jpexmocks)
[![Code Climate](https://codeclimate.com/github/jackmellis/jpexmocks/badges/gpa.svg)](https://codeclimate.com/github/jackmellis/jpexmocks)
[![Test Coverage](https://codeclimate.com/github/jackmellis/jpexmocks/badges/coverage.svg)](https://codeclimate.com/github/jackmellis/jpexmocks/coverage)

This is intended to be used when unit testing using the Jpex class framework. It adds several extra features to your classes so that you can easily mock out and test your code.

## Installation  
`npm install jpex-mocks`

## Usage  
Node:  
```javascript
const Jpex = require('jpex');
const mocks = require('jpex-mocks');
Jpex.use(mocks);

// You can now start mocking stuff
Jpex.$set('myFactory', {});
```

Webpack/Browserify:  
```javascript
var Jpex = require('jpex');
var mocks = require('jpex-mocks');
Jpex.use(mocks);
```

HTML/Javascript
```html
<script src="node_modules/jpex/dist/jpex.js"></script>
<script src="node_modules/jpex-mocks/dist/jpex-mocks.js"></script>
<script>
Jpex.use(jpexMocks);
</script>
```

You can then use *jpex-mocks* to enhance your unit tests:
```javascript
beforeAll(() => {
  Jpex = require('jpex');
  var mocks = require('jpex-mocks');
  Jpex.use(mocks);
});
beforeEach(() => {
  Jpex.$set('mockMeOut', {});
});
// Tests
afterEach(() => {
  Jpex.$reset();
});
```

The plugin does not necessarily have to be used on the Jpex class, you can mock out only a specific class:
```javascript
var MyClass = require('../classes/myclass');
MyClass.use(mocks);
```
Although any class that inherits *MyClass* will also inherit the mocking properties.

## API  
### Properties  
#### $children  
`Class.$children`  
This will return a list of all classes that directly inherit the current class.

#### $descendants  
`Class.$descendants`  
Similar to *$children* except that if a child class has its own children, these will be included.

#### $instances  
`Class.$instances`  
Returns a list of all instances of the current class.

#### $stubFn  
`Class.$stubFn = () => { return () => {}; };`  
The `$stubFn` determines what should be used when `$stub()` is called. It should be a function that returns another function. The default stub function will check for the existence of `jasmine` and `sinon` and return a spy if possible, otherwise it will return an empty function.  
`$stubFn` can accept the original function as a parameter
```javascript
Class.$stubFn = function (original) {
  return function (...args) {
    // do some stuff
    return original.apply(this, args); // we can even call through to the original function if we want
  };
};

// or we can use a spy library...
Class.$stubFn = function () {
  return jasmine.createSpy();
};
```

#### $autoStub  
`Class.$autoStub = true|false|{ include, exclude }|null`  
While you can manually stub a service with `Class.$stub()`, you may just want to stub any factory that gets injected. Like `$stub`, `$autoStub` will use the return value of `$stubFn` to stub functions.  
Setting this to `true` will automatically stub all factories, `false` will stub no factories, and setting it to `null`/`undefined` will fall back to the parent Class's setting.  
You can also set `$autoStub` to an object containing an array of factories to include/exclude. This is useful if you only want to stub certain factories, or you have factories that you never want to stub.  
```javascript
Class.$autoStub = { exclude : ['$log', '$promise', '$timeout'] };
```

#### $beforeInvoke  
`Class.$beforeInvoke = callback`  
The **$beforeInvoke** property allows you add a callback that will be called just before the class's constructor function is called.
```javascript
Class.$beforeInvoke = function () {
  console.log('I have almost been created');
};
```
The **this** object will be set to the newly-created instance. The callback will receive the same arguments as the constructor function, i.e. the class's dependencies.

#### $afterInvoke  
`Class.$afterInvoke = callback`  
The **$afterInvoke** property allows you add a callback that will be called just after the class's constructor function is called.
```javascript
Class.$afterInvoke = function () {
  console.log('I have been fully created');
};
```
The **this** object will be set to the newly-created instance. The callback will receive the same arguments as the constructor function, i.e. the class's dependencies.

### Methods  
#### $get  
`Class.$get(name, namedParameters)`  
Resolves a specific dependency. **Name** can either be a string, or an array of strings. This is essentially the same as calling *Class.$resolve*.

#### $set  
`Class.$set(name, [dependencies], value)`  
Sets a mocked value for a factory. When the factory is resolved, this value will be used instead of any other value. Note that even if the factory is registered *after* using **$set**, the **$set** version will still be used.  
If **value** is a *function* it will be treated as a factory, and the return value of the function will be used. For any other type, it will treat it as a constant.  
The mocked factory will automatically be set as a singleton so will only be resolved once.  
```javascript
Class.$set('myFactory', function () {
  return 'foo';
});

Class.$get('myFactory'); // 'foo'

Class.register.factory('myFactory', () => 'bah');

Class.$get('myFactory'); // still 'foo'. Unless $unset or $reset are called
```

#### $unset  
`Class.$unset([names], [up], [down])`  
This will remove a mocked factory for the current class. If **names** is *null*, all factories registered with **$set** will be removed from the class.  
If **up** is true, it will remove factories from the parent classes as well (useful for unsetting a factory at an unknown point in the inheritance chain).  
If **down** is true, it will remove factories from the class's children as well.  
```javascript
Class.$unset('specificFactory');
Class.$unset(['a', 'b']);
Class.$unset('inheritedFactory', true);
Class.$unset(null, false, true); // remove all mocked factories from child classes
```

#### $inject  
`Class.$inject([dependencies], fn)`  
Inject is a combination of the `$get` and `$set` functions.  
The **function** parameters will be resolved and injected. You can then return an object containing additional dependencies to inject back into the class.
```javascript
Class.$inject(function(mySingletonService){
  mySingletonService.something = function(){}; // mutate mySingletonService

  return {
    $log : function(){} // overwrite $log
  };
});
```

#### $freeze  
`Class.$freeze(name, [alias], [namedParameters])`  
This will resolve a dependency and then **$set** it back on the class, ensuring that it is a singleton value. It will then return the resolved value.  
```javascript
var f = Class.$freeze('myFactory');
f === Class.$resolve('myFactory'); // true
```
The **alias** parameter allows you to register the resolved value under a different name.  

#### $stub  
`Class.$stub(name)`  
The `$stub` method will resolve a factory and then replace its methods with a stubbed function. The stubbed function is the return value of `Class.$stubFn`. This will also `$freeze` the factory.
```javascript
var service = Class.$stub('myService');
service.doSomething(); // calls a stubbed function instead of the real one
```

#### $on  
`Class.$on(eventName, callback)`  
**$on** exposes Jpex's event system that is normally reserved for plugins. The first argument is the name of the event to hook into. The callback receives a *context* object as its only argument. This contains information about that event.  
```javascript
Class.$on('extend', function ({Class, options}) {
  // do something whenever the class is extended
});
```
There are a number of events that can be hooked into:  
- extend
- options
- beforeCreate
- created
- privateProperties
- factories
- getFactory

#### $reset  
This will reset any modifications to the class.
- Firstly it will remove any factories registered using `$set`.  
- Then it will clear the dependency cache of *all* factories using `$clearCache`.  
- It will empty the `$children`, `$descendants` and `$instances` properties.  
- It will remove any functions attached to `$beforeInvoke` and `$afterInvoke`.  
- It will remove any event listeners registered via `$on`.  
- It will then recursively reset any child classes.  

### Factories  
*jpex-mocks* comes with a number of factories that overwrite the behaviour of the *jpex-defaults*, *jpex-node*, and *jpex-web* plugins.  
It is possible to skip this step with the following option:
```javascript
Jpex.use(mocks, { factories : false});
```

#### $timeout  
`$timeout(callback, delay)`  
Queues up a timeout. The timeout is *not* called asynchronously and must be triggered by calling `$timeout.flush()`.  
If you pass a numeric value into the *flush* method, only timeouts that would have been called after that amount of time will be flushed. The amount if cumulative, meaning that every time you call `flush(n)` the value *n* will be added to the total elapsed time.  

#### $interval  
`$interval(callback, delay)`  
Queues up an interval. The callback is *not* called asynchronously and must be triggered by calling `$interval.flush()`.  
Like *$timeout*, `$interval.flush` can be called with a numeric value.

#### $immediate  
`$immediate(callback)`  
Queues up a callback which can be triggered by calling `$immediate.flush()`.

#### $tick  
`$tick(callback)`  
Queues up a callback which can be triggered by calling `$immediate.flush()`.

#### $log  
`$log(message)`  
Rather than outputting messages to the console, the mocked **$log** factory has a **messages** property which is appended to.  

#### $promise  
`$promise(callback)`  
Like the timer factories, the mock **$promise** factory is synchronous. Any promises made using **$promise** will be flushed when you call `$promise.flush()`.  
If a promise doesn't get resolved in a flush cycle, it will be checked again on the next call and so on until it is resolved.  
**$promise** has a list of all promises that can be accessed via `$promise.promises`. Each promise then has a state (pending, fulfilled, rejected) and its own flush function, meaning you can flush promises individually.  
Keep in mind that if you attempt to flush a promise that relies on another promise, that promise will also be flushed
```javascript
var $promise = Class.$get('$promise');

$promise((resolve, reject) => { resolve(4); });

$promise.flush();
```

#### $fs  
The **$fs** factory is mocked out and made syncronous. All IO operations are made on a configurable file structure. In the background this uses [mock-fs](https://github.com/tschaub/mock-fs) to mock out Node's *fs* module. Use the `$fs.use` function to provide your mock file system. For more information about the structure of this object, see the documentation for **mock-fs**. As with **$promise**, use `$fs.flush()` to resolve its calls.
```javascript
var $fs = Class.$get('$fs');
$fs.use({
  'lib/img/img1.txt' : 'file contents',
  'lib/img/img2.txt' : 'more contents'
});

$fs.readdir('./lib/img')
  .then(function(){ ... })
  .catch(function(){ ... });

$fs.flush();

// As $fs is promise-based you can also flush your methods using $promise.flush();
$promise.flush();
```

#### $window  
**jpex-mocks** provides a mock *$window* object. This is only a simple mock object with only one property: `$window.document`.  

#### $document  
The **$document** factory returns the document object from **$window**. This is just a plain object.
