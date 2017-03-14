var hasOwn = require('jpex/src/hasOwn');

module.exports = function (name, dependencies, value) {
  // Back up the original
  var hasOwnFactory = hasOwn(this.$$factories, name);
  var backup = this.$$factories[name];
  var f;

  if (arguments.length === 2){
    value = dependencies;
    dependencies = null;
  }

  // Register the factory and copy it to the mock object
  if (typeof value === 'function'){
    f = this.register.factory(name, dependencies, value).lifecycle.application();
    this.$$mock.factories[name] = this.$$factories[name];
  }else{
    f = this.register.constant(name, value);
    this.$$mock.factories[name] = this.$$factories[name];
  }

  // Remove the newly-registered factory
  if (hasOwnFactory){
    this.$$factories[name] = backup;
  }else{
    delete this.$$factories[name];
  }

  return f;
};
