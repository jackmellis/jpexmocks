var resolver = require('jpex/src/resolver');

module.exports = function (dependencies, fn) {
  if (typeof dependencies === 'function'){
    fn = dependencies;
    dependencies = null;
  }

  if (!dependencies){
    dependencies = resolver.extractParameters(fn);
  }
  dependencies = [].concat(dependencies);

  var Class = this;
  var args = this.$get(dependencies);

  var result = fn.apply(Class, args);

  if (typeof result === 'object'){
    Object.keys(result).forEach(function (name) {
      Class.$set(name, result[name]);
    });
  }
};
