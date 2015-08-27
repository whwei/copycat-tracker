var Tracker = require('../tracker')

function ReactiveDict() {
	this.map = {}
	this.dep = new Tracker.Dependency
	this.depsMap = {}
}
ReactiveDict.prototype.get = function(key) {
	if (this.depsMap[key]) {
		this.depsMap[key].depend()
	}
	this.dep.depend()
	return this.map[key]
}
ReactiveDict.prototype.set = function(key, value) {
	if (!this.depsMap[key]) {
		this.depsMap[key] = new Tracker.Dependency
	}
	this.map[key] = value
	this.dep.changed()
	this.depsMap[key].changed()
}


module.exports = {
	ReactiveDict: ReactiveDict
}