var Tracker = {
  Dependency: Dependency,
  currentComputation: null,
  _pendingComputations: [],
  _computations: {},
  
  autorun: autorun,
  flush: flush,
  nonreactive: nonreactive
}

// autorun
function autorun(fn) {

  var computation = new Computation(fn, Tracker.currentComputation)

  return computation
}

function flush() {
  var counter = 0
  
  while (Tracker._pendingComputations.length) {
    var computation = Tracker._pendingComputations.shift()
    
    computation._recompute()
    
    if (computation._needsRecompute()) Tracker._pendingComputations.unshift(computation)

    // prevent infinite loop    
    if (counter++ > 100) return
  }
}


function nonreactive(fn) {
  var prevComputation = Tracker.currentComputation
  
  Tracker.currentComputation = null
  
  try {
    fn()
  } finally {
    Tracker.currentComputation = prevComputation
  }
}


// Computation

var nextId = 0

// Computation
function Computation(fn, parent) {
	
  this.firstrun = true
  this.id = nextId++
  this._fn = fn
  this._parent = parent

  this.stopped = false
  this.invalidated = false
  this._recomputing = false

  this._onInvalidateCallbacks = []
  this._onStopCallbacks = []
  
  Tracker._computations[this.id] = this

  // if throw an error, stop it
  var error = true
  try {
    this._compute()
    error = false	
  } finally {
    this.firstrun = false
    if (error) {
      this.stop()
    }
  }
}

Computation.prototype.invalidate = function () {
  if (!this.invalidated) {
  if (!this._recomputing && !this.stopped) {
    setTimeout(Tracker.flush, 0)
    Tracker._pendingComputations.push(this)
  }

  this.invalidated = true

  for (var i = 0; i < this._onInvalidateCallbacks.length; i++) {
    this._onInvalidateCallbacks[i](this);  
  } 
    this._onInvalidateCallbacks = []
  }
}
Computation.prototype.onInvalidate = function (fn) {
  if (this.stopped) {
    fn(this)
  } else {
    this._onInvalidateCallbacks.push(fn)
  }
}

Computation.prototype.stop = function () {
  if (!this.stopped) {
  	this.invalidated = true
  	
  	// delete computation from Tracker
  	delete Tracker._computations[this.id]
  	
  	for (var i = 0; i < this._onInvalidateCallbacks.length; i++) {
      this._onInvalidateCallbacks[i](this);
  	}
    this._onStopCallbacks = [] 
  }
}
Computation.prototype.onStop = function (fn) {
  if (this.stopped) {
    fn(this)
  } else {
    this._onStopCallbacks.push(fn)
  }
}

Computation.prototype._compute = function () {
  var prevComputation = Tracker.currentComputation
  Tracker.currentComputation = this

  this.invalidated = false

  this._fn(this)

  // restore computation
  Tracker.currentComputation = prevComputation
}

Computation.prototype._recompute = function () {
  this._recomputing = true
  
  this._compute();
  
  this._recomputing = false
}

Computation.prototype._needsRecompute = function () {
  return this.invalidated && !this.stopped
}




// Dependency
function Dependency() {
  this.dependents = {}
}

Dependency.prototype.depend = function(computation) {
  computation = computation || Tracker.currentComputation
  
  if (!computation) return

  if (!this.dependents[computation.id]) {
    this.dependents[computation.id] = computation

    computation.onInvalidate(function() {
      delete this.dependents[computation.id]
    }.bind(this))
  }
}

Dependency.prototype.changed = function() {
  for (var id in this.dependents) {
    this.dependents[id].invalidate()
  }
}




module.exports = Tracker
