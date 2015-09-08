var Dependency = require('../src/tracker').Dependency

var ReactiveDict = function() {
  this.map = {}
  this.dependencies = {}
}

ReactiveDict.prototype.get = function(key) {
  if (!this.map[key]) return null
  
  this.dependencies[key].depend()
  return this.map[key]
}

ReactiveDict.prototype.set = function(key, value) {
  this.map[key] = value
  
  if (!this.dependencies[key]) {
  	this.dependencies[key] = new Dependency()
  }
  this.dependencies[key].changed()
}

module.exports = ReactiveDict