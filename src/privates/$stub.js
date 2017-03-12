var stubObject = require('../stub/stubObject');

module.exports = function (name, namedParameters) {
  var optional = '_' + name + '_';
  var result = this.$get(optional, namedParameters);

  result = stubObject.call(this, result);

  this.$set(name, [], function(){
    return result;
  }).lifecycle.application();

  return result;
};
