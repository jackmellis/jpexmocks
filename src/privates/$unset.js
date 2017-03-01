module.exports = function (names, up, down) {
  names = [].concat(names || []);

  for (var key in this.$$mock.factories){
    if (Object.hasOwnProperty.call(this.$$mock.factories, key)){
      if (!names.length || names.indexOf(key) > -1){
        delete this.$$mock.factories[key];
      }
    }
  }
  if (up){
    this.$$parent && this.$$parent.$unset && this.$$parent.$unset(names, true, false);
  }
  if (down){
    this.$children && this.$children.length && this.$children.forEach(function (child) {
      child.$unset(names, false, true);
    });
  }
};
