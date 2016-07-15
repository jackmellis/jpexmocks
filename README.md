jpex Mocks
===========
Mocking Library for Jpex
------------------------

This is intended to be used when unit testing using the Jpex class framework. It adds several extra features to your classes so that you can easily mock out and test your classes.

To use 

You can pass in a specific class to mock, otherwise it will mock the base class, meaning that every subsequent class will be mocked.
Once a class had been mocked, any classes that extend the class will be tracked and automatically mocked as well.
A mocked class will also get a mock object with a number of properties

Children
An array of classes that have inherited the class. This is direct children only.

Instances
Any time the Xmas is instantiated the instance will be added to this array

Get
This will pull out any dependencies being used by the class so that they can be manipulated or held in memory. Keep in mind that if you get a factory or service that is not a Sibgketon it will be a different instance to that used when the class is instant. For this you will want the inject or beforeInvoke fn

Set
Overwrites a Deo. The val will be injected into the class when instantiated. The Deo will be inherited by child classes. If the value is s fn it will be treated as a factory, otherwise it'd assumed a constant 

Inject
Inject is s combination of the get and set functions.
Any parameters in the fn will be injected into the function. You can then return an object containing dependencies to inject back into the class

Unset
This will revert a mocked dependency back to its original form. Note that you must unset the dependency on the class it was declared on, you cannot unset an inherited mock dependency.

BeforeInvoke
This fn will be invoked immediately before a class is instantiated. The function parameters will be injected as expected, however, any factories or services will be the same instances that will be passed into the constructor. As with inject, you can return an object contain gin dependencies that will be passed into constructor. The context (this) will be the instance

InvokeAfter
Much like InvokeBefore this will be called immediately after the class is instantiated.

Reset
This will reset the class the class to its pre-mocked state. If deep is true, it will also reset all child classes. Keep in mind that if you don't reset s child class that relies on a mock dependency of its parent, it will no longer find it.
It's extremely advisable to reset your mocked classes after every test.

Some predefined Factorirs are autom mocked out:
Timeout etc
Timeouts will not just timeout on their own and must be cleared out with the flush function.

Promise
Promises also become synchronous and promises will only be resolved after calling $promise.flush(). If a promise doesn't get resolved in a flush, it will checked again on the next call and so on until it is resolved.
$promise has a list of all promises that can be accessed via $promise.promises. Each promise then has a state (pending, fulfilled, rejected) and its own flush function, meaning you can flush promises individually.
Keep in mind that if you attempt to flush a promise that relies on another promise, that promise will also be flushed

Log
For the sake of not polluting the console during testing, all log methods are mocked out and do not log to the console. Any calls to log will be added to the messages property.

If you want to restore the original version of these factories, you can use under to undo them
