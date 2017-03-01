module.exports = function (name, fn) {
  var pname = 'jpex-mocks-plugin-';
  var index = 0;
  while (this.$$using[pname + index]){
    index++;
  }
  pname += index;


  this.$$mock.listeners[name] = this.$$mock.listeners[name] || [];
  this.$$mock.listeners[name].push(fn);

  this.use({
    name : pname,
    install : function (options) {
      options.on(name, fn);
    }
  });
};
