Change Log
==========

## 2.0.0  
- Complete redesign of the background code  
- `Jpex.mock.children` becomes `Jpex.$children`  
- `Jpex.mock.descendants` becomes `Jpex.$descendants`  
- `Jpex.mock.instances` becomes `Jpex.$instances`  
- `Jpex.mock.get` becomes `Jpex.$get`  
- `Jpex.mock.set` becomes `Jpex.$set`  
- `Jpex.mock.unset` becomes `Jpex.$unset`  
- `Jpex.mock.inject` becomes `Jpex.$inject`  
- `Jpex.mock.beforeInvoke` becomes `Jpex.$beforeInvoke`  
- `Jpex.mock.afterInvoke` becomes `Jpex.$afterInvoke`  
- `Jpex.mock.unsetDefaults` removed  
- Added `Jpex.$on` to attach event listeners  
- Added `$document` and `$window` factories.  
- Added `$stub` method as well as `$autoStub` and `$stubFn` properties, allowing you to automatically stub all functions of a factory.

## 1.4.0  
- Compatibility compliance with Jpex 1.4.0.

## 1.3.1  
### Bugs  
- $log now correctly implements the $ilog interface  
- `Class.mock.create` / `Class.mock.freeze` creates properties from child/nested interfaces  
## 1.3.0
### Features
- Create and Freeze methods added
- Interfaces functionality added  
### Bugs
- Already-resolved $promises can now be added to using `.then` and `.catch`
- `$promise.all` should always resolve in one flush action (unless there are linked outstanding promises)
