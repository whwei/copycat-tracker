var Dependency = require('./dependency')
var Computation = require('./computation')

var Tracker = {
  Dependency: Dependency,
  autorun: autorun,
  _currentComputation: null
}


// autorun
function autorun(fn) {

  var computation = new Computation


  return computation
}

module.exports = Tracker
