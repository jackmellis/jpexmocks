var createPrivateProperties = require('./privates');
var defaultsPlugin = require('./defaults');
var stubber = require('./stub');

exports.name = 'jpex-mocks';
exports.install = function (options) {
  var Jpex = options.Jpex;
  var on = options.on;
  options = Object.assign({
    factories : true
  }, options.options);

  if (options.factories){
    Jpex.use(defaultsPlugin);
  }

  Object.defineProperties(Jpex, createPrivateProperties(Jpex, Jpex.$$parent));

  on('privateProperties', function (context) {
    var privates = createPrivateProperties(context.Class, context.Class.$$parent);

    context.apply(privates);
  });

  on('extend', function (context) {
    var Class = context.Class;
    var Parent = Class.$$parent;

    if (Parent.$$mock && Parent.$$mock.children){
      Parent.$$mock.children.push(Class);
    }
  });

  on('beforeCreate', function (context) {
    var Class = context.Class;
    var instance = context.instance;
    var args = context.args;

    if (Class.$$mock.beforeInvoke){
      Class.$$mock.beforeInvoke.apply(instance, args);
    }
  });

  on('created', function (context) {
    var Class = context.Class;
    var instance = context.instance;
    var args = context.args;

    Class.$$mock.instances.push(instance);

    if (Class.$$mock.afterInvoke && typeof Class.$$mock.afterInvoke === 'function'){
      Class.$$mock.afterInvoke.apply(instance, args);
    }
  });

  on('getFactory', function (context) {
    var Class = context.Class;
    var set = context.set;
    var name = context.factoryName;

    if (Class.$$mock.factories[name]){
      set(Class.$$mock.factories[name]);
    }else if (!Class.$$factories[name]){
      // If the factory hasn't been registered, it might be a node module
      // Shortcut checking for its existence so it gets registered as a constant
      try{
        Class.$$getFromNodeModules(name);
      }catch(e){
        // Doesn't exist in node modules either
      }
    }

    stubber(Class, name);
  });
};
