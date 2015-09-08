function Logger() {
	this.log = []	
}
Logger.prototype.logger = function(text) {
	this.log.push(text)
}

module.exports = {
	Logger: Logger
}