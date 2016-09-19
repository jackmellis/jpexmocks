module.exports = function(Base){
  // Remove all mock properties from the class
  Base.mock.reset = function(deep){
    // Replace all mocked dependencies
    Object.keys(Base._mock.factories).forEach(function(f){
      Base.mock.unset(f);
    });

    // Replace the extend function
    Base.extend = Base._mock.extend;

    // Unmock children
    if (deep){
      Base.mock.children.forEach(function(c){
        if (c.mock && c.mock.reset){
          c.mock.reset(deep);
        }
      });
    }

    // Remove the mock object
    delete Base._mock;
    delete Base.mock;
  };
};