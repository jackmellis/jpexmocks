module.exports = function(){
  var q = [];
  var t = function(fn){
    q.push(fn);
  };
  t.flush = function(force){
    if (!q.length && !force){
      throw new Error("Could not flush as there were no items to flush");
    }
    q.forEach(function(fn){
      fn();
    });
    q = [];
  };
  t.count = function(){
    return q.length;
  };
  
  return t;
};