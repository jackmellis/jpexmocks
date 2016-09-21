Change Log
==========

##1.3.0
###Features
- Create and Freeze methods added
- Interfaces functionality added  
###Bugs
- Already-resolved $promises can now be added to using `.then` and `.catch`
- `$promise.all` should always resolve in one flush action (unless there are linked outstanding promises)
