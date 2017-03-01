module.exports = function (Parent) {
  var $$mock = {};
  $$mock.children = [];
  $$mock.instances = [];
  $$mock.factories = Object.create(Parent && Parent.$$mock && Parent.$$mock.factories || null);
  $$mock.listeners = {};
  $$mock.beforeInvoke = [];
  $$mock.afterInvoke = [];

  return $$mock;
};
