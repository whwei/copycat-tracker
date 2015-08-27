var Tracker = {
  Dependency: Dependency,
  autorun: autorun,
  _currentComputation: null
}


// Dependency
function Dependency() {
	
}

Dependency.prototype.depend = function() {
	
}

Dependency.prototype.changed = function() {
	var computation = Tracker._currentComputation
  
  if (computation) computation()
}



// autorun
function autorun(run) {

  if (run) {
    Tracker._currentComputation = run
    run()
  }
	
  return {
    stop: function() {
      Tracker._currentComputation = null
    }
  }
}

module.exports = Tracker