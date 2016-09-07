Jpex Mocks
===========
Mocking Library for Jpex
------------------------
[![Build Status](https://travis-ci.org/jackmellis/jpexmocks.svg?branch=master)](https://travis-ci.org/jackmellis/jpexmocks)

This is intended to be used when unit testing using the Jpex class framework. It adds several extra features to your classes so that you can easily mock out and test your classes.

Usage
-----
```javascript
describe('Test Suite', function(){
  var jpex, mock, MyClass, systemUnderTest;

  beforeEach(function(){
    jpex = require('jpex');
    mock = require('jpexmocks');

    MyClass = require('./myclassdeclration'),
    
    mock(MyClass); // From this point, anything that extends MyClass will be mocked out

    systemUnderTest = require('./service/thingy');
  });
  
  afterEach(function(){
    MyClass.mock.reset(true); // Reset everthing back to a pre-mocked state
  });

  it('should test using jpexmocks', function(){
    var service;
  
    // Inject dependencies into the class
    MyClass.mock.inject(function(myService){
      service = myService;
      spyOn(myService, 'doSomething');
      return {
        $log : function(){}
      };
    });
    
    // Run functions before and after instantiating the class
    MyClass.mock.afterInvoke(function(){
      expect(this.property).toBe(true);
    });
    
    systemUnderTest.go();
    
    expect(service.doSomething).toHaveBeenCalled(); // etc.
  });
});
```

You can pass in a specific class to mock, otherwise it will mock the base class, meaning that every subsequent class will be mocked.
Once a class had been mocked, any new classes that extend it will be tracked and automatically mocked as well.

###Mock Properties
A mock object will be attached to each mocked class with a number of properties:

####children
An array of classes that have inherited the class. This is direct children only.
```javascript
var SubClass = MyClass.extend();

MyClass.mock.children[0] === SubClass;
```

####descendants
An array of classes that have inherited the class or any descendant class.
```javascript
var SubClass = MyClass.extend();
var SubSubClass = SubClass.extend();

MyClass.mock.children[0] === SubClass;
MyClass.mock.children[1] === SubSubClass;
```

####instances
Any time the class is instantiated, the new instance will be added to this array.
```javascript
var instance = new MyClass();

MyClass.mock.instances[0] === instance;
```

####get
This will pull out any dependencies being used by the class so that they can be manipulated or held in memory.  
Keep in mind that if you get a factory or service that is not a singleton it will be a different instance to that used when the class is instantiated. For this you will want the inject or beforeInvoke functions.
```javascript
var myService = MyClass.mock.get('myService');
```

####set
Injects a dependency into the class. The value will be injected into the class when instantiated.  
The dependency will be inherited by child classes.  
If the value is a function it will be treated as a factory, otherwise it is injected as a constant.
```javascript
MyClass.mock.set('constant', 'bob');
MyClass.mock.set('factory', function(){
  return {};
});
```

####inject
Inject is a combination of the get and set functions.  
The function parameters will be resolved and injected. You can then return an object containing additional dependencies to inject back into the class.
```javascript
MyClass.mock.inject(function(mySingletonService){
  mySingletonService.something = function(){};
  
  return {
    $log : function(){}
  };
});
```

####unset
This will revert a mocked dependency back to its original form. Note that you must unset the dependency on the class it was declared on, you cannot unset an inherited dependency.
```javascript
MyClass.mock.set('f1', {});
SubClass.mock.set('f2', {});

SubClass.mock.unset('f2'); // This will revert f2 back to its original factory, if there was one.

SubClass.mock.unset('f1'); // This will not do anthing, subclass will still use the mocked factory from MyClass

MyClass.mock.unset('f1'); // Now both MyClass and SubClass will revert to the original factory.
```

####beforeInvoke
This function will be invoked immediately before a class is instantiated. The function parameters will be injected as expected, however, any factories or services will be the same instances that will be passed into the constructor.  
As with inject, you can return an object containing dependencies that will be passed into the constructor.  
The context (this) will be the instance.
```javascript
MyClass.beforeInvoke(function(myServiceInstance){
  myServiceInstance.something = function(){};
  this.someProperty = 'mocked out';
  
  return {
    $log : function(){}
  };
});
```

####invokeAfter
Much like invokeBefore, this will be called immediately after the class is instantiated.

####reset
This will reset the class the class to its pre-mocked state. If deep is true, it will also reset all child classes.  
Keep in mind that if you don't reset s child class that relies on a mock dependency of its parent, it will no longer find it.  
It's extremely advisable to reset your mocked classes after every test.

###Predefined Factories
Some predefined factories are automatically mocked out:

####Timers ($timeout, $interval, $immediate, $tick)
Timeouts will not just trigger on their own and must be cleared out with the flush function.
```javascript
var $timeout = MyClass.mock.get('$timeout');
var instance = new MyClass();
$timeout.flush();
expect(something).toHaveHappened();
```

####$promise
Promises also become synchronous and will only be resolved after calling $promise.flush().  
If a promise doesn't get resolved in a flush cycle, it will be checked again on the next call and so on until it is resolved.  
$promise has a list of all promises that can be accessed via `$promise.promises`. Each promise then has a state (pending, fulfilled, rejected) and its own flush function, meaning you can flush promises individually.  
Keep in mind that if you attempt to flush a promise that relies on another promise, that promise will also be flushed
```javascript
var $p = MyClass.mock.get('$promise');
var instance = new MyClass();

$p.promises[0].state === 'pending' // true
$p.flush();   // or $p.promises[0].flush();
$p.promises[0].state === 'fulfilled' // true
```

####$log
For the sake of not polluting the console during testing, all log methods are mocked out and do not log to the console. Any calls to $log will be added to the messages property.
```javascript
var $log = MyClass.mock.get('$log');
var instance = new MyClass();

$log.messages.length === 1;
```

####$fs  
The [$fs](https://github.com/jackmellis/jpex/jpex-fs) factory is mocked out and made syncronous. All IO operations are made on a dummy file structure you provide. In the background this uses [mock-fs](https://github.com/tschaub/mock-fs) to mock out Node's *fs* module. Use the $fs.use function to provide your mock file system. For more information about the structure of this object, see the documentation for mock-fs. As with $promise, use $fs's flush method to resolve its calls.
```javascript
var $fs = MyClass.mock.get('$fs');
$fs.use({
  'lib/img/img1.png',
  'lib/img/img2.png'
});

$fs.readdir('./lib/img')
  .then(function(){})
  .catch(function(){});
$fs.flush();

// As $fs is promise-based you can also flush your methods using $promise.flush();
MyClass.mock.get('$promise').flush();
```

If you want to restore the original version of these factories, you can use `unset` to undo them individually, or `unsetDefaults` to restore them all.
```javascript
mock(MyClass);

MyClass.mock.unsetDefaults();
```