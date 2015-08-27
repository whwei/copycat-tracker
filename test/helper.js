function Logger() {
	this.log = []	
}
Logger.prototype.logger = function(text) {
	this.log.push(text)
}
Logger.prototype.get = function(index) {
	return this.log[index]
}


module.exports = {
	Logger: Logger
}