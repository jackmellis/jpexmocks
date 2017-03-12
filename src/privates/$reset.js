module.exports = function () {
  var self = this;
  // Remove mocked factories
  this.$unset();
  // Clear cached dependencies
  this.$clearCache();
  // Remove instances
  this.$$mock.instances.splice(0);
  // Remove children
  var children = this.$$mock.children.splice(0);
  // Clear before/after invokes
  this.$$mock.beforeInvoke = null;
  this.$$mock.afterInvoke = null;
  // Remove hooks added via $on
  Object.keys(this.$$mock.listeners).forEach(function (key) {
    var listeners = self.$$mock.listeners[key];
    listeners.forEach(function (fn) {
      var hooks = self.$$hooks[key];
      if (!hooks){
        return;
      }
      for (var x = 0, l = hooks.length; x < l; x++){
        if (hooks[x] === fn){
          delete hooks[x];
          return;
        }
      }
    });
  });
  this.$$mock.listeners = {};
  // Recurse
  children.forEach(function (child) {
    child.$reset();
  });
};
