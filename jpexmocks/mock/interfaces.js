var oCount = 101;

module.exports = function(Base){
  // Create a dependency (specifically an interface)
  Base.mock.create = function(name){
    var ifc = Base._interfaces[name];
    if (!ifc){
      return Base.mock.get(name);
    }

    var $typeof = Base.mock.get('$typeof');

    return createInterfaceObj(ifc.pattern);

    function createInterfaceObj(pattern){
      switch($typeof(pattern)){
        case 'string':
          return 'string ' + (oCount++);
        case 'number':
          return oCount++;
        case 'regexp':
          return (/.*/);
        case 'date':
          return new Date();
        case 'function':
          var fn = (function(){});
          Object.keys(pattern).forEach(k => fn[k] = createInterfaceObj(pattern[k]));
          return fn;
        case 'object':
          var obj = {};
          Object.keys(pattern).forEach(k => obj[k] = createInterfaceObj(pattern[k]));
          return obj;
        case 'array':
          switch(pattern.iType){
            case 'any':
              pattern = ['', 0, /a/, new Date(), () => {}, {}, [], null];
              /* falls through */
            case 'either':
              var index = Math.floor(Math.random() * pattern.length);
              return createInterfaceObj(pattern[index]);

            default:
              if (!pattern.length){
                return [];
              }
              var arrayLength = Math.floor(Math.random() * 6);
              return (new Array(arrayLength)).fill(pattern[0]).map(createInterfaceObj);
          }
          break;

        default:
          return pattern;
      }
    }
  };

  // Create many instances of a dependency
  Base.mock.createMany = function(name, count){
    return (new Array(count)).fill(name).map(this.create);
  };

  // Create a dependency and then freeze it against the class
  Base.mock.freeze = function(name, as){
    var obj = this.create(name);
    var isInterface = !!Base._interfaces[name];

    if (isInterface){
      as = as || 'frozen' + name + (oCount++);
    }else{
      as = as || name;
    }

    var f = this.set(as, () => obj)
      .lifecycle.application();

    if (isInterface){
      f.interface(name);
    }

    return obj;
  };
};
