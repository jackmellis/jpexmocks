module.exports = function(){
  var $promise = function(fn){
    
    var promise = new PromiseClass();
    $promise.promises.push(promise);
    
    var hasError, error, value = unresolvedObject;
    
    return promise._firstThen(function(){
      // Run the constructor function
      return fn(function(v){
        value = v || null;
      }, function(err){
        error = err;
        hasError = true;
      });
    })
    .then(function(){
      if (hasError){
        throw error;
      }else{
        return value;
      }
    });
  };
  $promise.promises = [];
  $promise.all = function(arr){
    var result = [];
    var $p = $promise.resolve();
    arr.forEach(function(p){
      $p = $p
      .then(function(){
        return p;
      })
      .then(function(v){
        result.push(v);
      });
    });
    return $p.then(function(){
      return result;
    });
  };
  $promise.race = function(arr){
    var hasResolved = false;
    return $promise(function(resolve, reject){
      arr.forEach(function(p){
        $promise.resolve(p)
        .then(function(val){
          if (!hasResolved){
            hasResolved = true;
            resolve(val);
          }
        }, function(val){
          if (!hasResolved){
            hasResolved = true;
            reject(val);
          }
        })
        .flush();
      });
    });
  };
  $promise.reject = function(val){
    return $promise(function(resolve, reject){
      reject(val);
    });
  };
  $promise.resolve = function(val){
    return $promise(function(resolve){
      resolve(val);
    });
  };
  
  $promise.flush = function(){
    var prestate;
    var poststate = this.promises.map(p => p.state).join('-');
    
    // Keep going until there are no state changes
    while (poststate !== prestate){
      prestate = poststate;
      
      // Flush the promises
      this.promises.forEach(function(p){
        if (p.state === 'pending' || p.state === 'unresolved'){
          try{
            p.flush();
          }
          catch(e){}
        }
      });
    
      poststate = this.promises.map(p => p.state).join('-');
    }
  };
  
  return $promise;
};

function PromiseClass(){
  this.queue = [];
  this.state = 'pending';
  this.resolvedWith = null;
}
PromiseClass.prototype._firstThen = function(onResolve, onReject){
  this.queue.push({then : onResolve, catch : onReject, isFirst : true});
  return this;
};
PromiseClass.prototype.then = function(onResolve, onReject){
  this.queue.push({then : onResolve, catch : onReject});
  return this;
};
PromiseClass.prototype.catch = function(onReject){
  return this.then(null, onReject);
};

PromiseClass.prototype.flush = function(){
  switch(this.state){
  case 'fulfilled':
//  case 'unresolved':
    return this.resolvedWith;
  case 'rejected':
    throw this.resolvedWith;
  }

  var val, err, hasError;
  this.queue = this.queue.filter((q) => {
    if (val === unresolvedObject){
      return true; //Keep this as it's not been resolved yet
    }
    
    try{
      if (hasError && q.catch){
        val = q.catch(err);
        err = null;
        hasError = false;
      }else if (!hasError && q.then){
        val = q.then(val);
      }
      
      if (!q.isFirst && val && typeof val.then === 'function' && typeof val.catch === 'function'){
        // We've been passed a promise so we need to wait for it to resolve...
        var newPromise = val;
        q.then = function(){
          return newPromise.flush();
        };
        q.catch = null;
        val = unresolvedObject;
        return true;
      }
    }
    catch(e){
      val = null;
      err = e;
      hasError = true;
    }
    
    if (val === unresolvedObject){
      return true;
    }
    
    return false;
  });
  
  if (val === unresolvedObject){
    this.state = 'unresolved';
    this.resolvedWith = unresolvedObject;
    return unresolvedObject;
  }

  if (hasError){
    this.state = 'rejected';
    this.resolvedWith = err;
    throw err;
  }
  
  this.state = 'fulfilled';
  this.resolvedWith = val;
  return val;
};

var unresolvedObject = {};