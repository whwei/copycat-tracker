
// Dependency
function Dependency() {

}

Dependency.prototype.depend = function() {

}

Dependency.prototype.changed = function() {
  for (var id in this.dependents) {
    this.dependents[id].invalidate()
  }
}

module.exports = Dependency
