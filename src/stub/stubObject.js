module.exports = function (obj) {
  var target, key;

  switch (typeof obj){
  case 'function':
    target = this.$stubFn(obj);
    for (key in obj){
      if (typeof obj[key] === 'function'){
        target[key] = this.$stubFn(obj);
      }else{
        target[key] = obj[key];
      }
    }
    return target;

  case 'object':
    target = Object.assign({}, obj);
    for (key in obj){
      if (typeof obj[key] === 'function'){
        target[key] = this.$stubFn(obj[key]);
      }
    }
    return target;

  case 'undefined':
    return {};

  default:
    return obj;
  }
};
