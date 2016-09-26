var oCount = 101;

module.exports = function(Base){
  // Create a dependency (specifically an interface)
  Base.mock.create = function(name){
    var interface = Base._getInterface(name);
    if (!interface){
      return Base.mock.get(name);
    }

    var result;

    listInterfaces(name)
      .map(i => Base._getInterface(i).pattern)
      .forEach(i => result = createInterfaceObj(i, result));

    return result;

    function listInterfaces(name){
      var list = [].concat(name);

      list.forEach(function(n){
        var interface = Base._getInterface(n);
        if (interface && interface.interface && interface.interface.length){
          var arr = interface.interface.map(i => listInterfaces(i));
          if (arr && arr.length){
            list = list.concat.apply(list, arr);
          }
        }
      });

      return list;
    }

    function createInterfaceObj(pattern, target){
      var type = Base.Typeof(pattern);

      switch(type){
        case 'function':
        case 'object':
        case 'array':
          break;
        default:
          if (target !== undefined){
            return target;
          }
      }

      switch(type){
        case 'string':
          return 'string ' + (oCount++);
        case 'number':
          return oCount++;
        case 'regexp':
          return (/.*/);
        case 'date':
          return new Date();
        case 'function':
          var fn = (typeof target === 'function') ? target : (function(){});
          Object.keys(pattern).forEach(k => fn[k] = createInterfaceObj(pattern[k], fn[k]));
          return fn;

        case 'object':
          var obj = (typeof target === 'object') ? target : {};
          Object.keys(pattern).forEach(k => obj[k] = createInterfaceObj(pattern[k], obj[k]));
          return obj;

        case 'array':
          switch(pattern.iType){
            case 'any':
              pattern = ['', 0, /a/, new Date(), () => {}, {}, [], null];
              /* falls through */
            case 'either':
              var index = Math.floor(Math.random() * pattern.length);
              return createInterfaceObj(pattern[index], target);

            default:
              if (Array.isArray(target)){
                return target;
              }
              if (!pattern.length){
                return [];
              }
              var arrayLength = Math.floor(Math.random() * 6);
              return (new Array(arrayLength)).fill(pattern[0]).map(v => createInterfaceObj(v));
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
    var isInterface = !!Base._getInterface(name);

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
