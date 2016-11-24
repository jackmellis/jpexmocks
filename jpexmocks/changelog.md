Change Log
==========
##1.4.0  
- Compatibility compliance with Jpex 1.4.0.

##1.3.1  
###Bugs  
- $log now correctly implements the $ilog interface  
- `Class.mock.create` / `Class.mock.freeze` creates properties from child/nested interfaces  
##1.3.0
###Features
- Create and Freeze methods added
- Interfaces functionality added  
###Bugs
- Already-resolved $promises can now be added to using `.then` and `.catch`
- `$promise.all` should always resolve in one flush action (unless there are linked outstanding promises)
