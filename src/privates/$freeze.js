module.exports = function (name, alias, namedParameters) {
  if (!namedParameters && alias && typeof alias === 'object'){
    namedParameters = alias;
    alias = name;
  }
  
  alias = alias || name;
  var optional = '_' + name + '_';
  var value = this.$get(optional, namedParameters);

  this.$set(alias, [], function () {
    return value;
  }).lifecycle.application();

  return value;
};
