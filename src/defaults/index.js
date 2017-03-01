var defaults = {
  $log : require('./$log'),
  $promise : require('./$promise'),
  $timeout : require('./$timeout'),
  $interval : require('./$interval'),
  $immediate : require('./$immediate'),
  $window : require('./$window'),
  $document : require('./$document'),
  $fs : safeRequire('./$fs'),
  $tick : safeRequire('./$tick')
};

function safeRequire(name) { // eslint-disable-line
  try{
    return eval('require(name)');
  }catch(e){
    return null;
  }
}

exports.name = 'jpex-mocks-defaults';
exports.install = function (options) {
  Object.keys(defaults).forEach(function (key) {
    if (defaults[key]){
      options.Jpex.register.factory(key, defaults[key].dependencies, defaults[key])
        .lifecycle.application();
    }
  });
};
