// Sets up a new class with mock properties
module.exports = function(Base){
  Base._mock = {};
  Base._mock.factories = {};

  Base.mock = {};
  
  require('./getters')(Base);
  require('./interfaces')(Base);
  require('./descendants')(Base);
  require('./reset')(Base);
};