module.exports = function(Base){
  // Children
  Base.mock.children = [];

  // Instances
  Base.mock.instances = [];

  // Invoke wrappers
  Base.mock.beforeInvoke = function(fn){
    Base._mock.beforeInvoke = fn;
  };
  
  Base.mock.afterInvoke = function(fn){
    Base._mock.afterInvoke = fn;
  };

  Object.defineProperties(Base.mock, 
  {
    descendants : {
      get : function(){
        var direct = Base.mock.children;
        var indirect = direct.map(m => m.mock.descendants);
        return Array.prototype.concat.apply(direct, indirect).filter((m, i, arr) => arr.indexOf(m) === i);
      }
    }
  });
};