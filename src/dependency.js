var Tracker = require('./tracker')

// Dependency
function Dependency() {
  this.dependents = {}
}

Dependency.prototype.depend = function() {
  var computation = Tracker.currentComputation

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

module.exports = Dependency
