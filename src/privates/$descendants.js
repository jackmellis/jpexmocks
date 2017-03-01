module.exports = {
  get : function () {
    var direct = this.$$mock.children;
    var indirect = direct
      .map(function (C) {
        return C.$descendants;
      })
      .filter(function (v) {
        return !!v;
      });
    return Array.prototype.concat.apply(direct, indirect)
      .filter(function (m, i, arr) {
        return arr.indexOf(m) === i;
      });
  }
};
