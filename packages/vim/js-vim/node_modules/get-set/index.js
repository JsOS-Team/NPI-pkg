var Event = require('./lib/Event')

var Set = module.exports = function() {}

Set.prototype = new Event();

Set.prototype.set = function(k,v) {
	if(v === undefined) {
		for(var i in k) {
			this.set(i,k[i]);
		}
		return;
	}
	this[k] = v;
	this.trigger('change:' + k,v);
};

Set.prototype.get = function(k) {
	return this[k]
};
