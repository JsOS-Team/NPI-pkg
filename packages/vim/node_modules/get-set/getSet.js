;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Event = require('./lib/event')

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

},{"./lib/event":2}],2:[function(require,module,exports){
module.exports = function() {};

/** 
 * Add a listener by event name
 * @param {String} name
 * @param {Function} fn
 * @return {Event} instance
 * @api public
 */
module.exports.prototype.on = function(name,fn) {

	//Lazy instanciation of events object
	var events = this.events = this.events || {};

	//Lazy instanciation of specific event
  events[name] = events[name] || [];

  //Give it the function
  events[name].push(fn);

  return this;

};


/** 
 * Trigger an event by name, passing arguments
 * 
 * @param {String} name
 * @return {Event} instance
 * @api public
 */
module.exports.prototype.trigger = function(name, arg1, arg2 /** ... */) {

	//Only if events + this event exist...
  if(!this.events || !this.events[name]) return this;

  //Grab the listeners
  var listeners = this.events[name],
    //All arguments after the name should be passed to the function
  	args = Array.prototype.slice.call(arguments,1);

  //So we can efficiently apply below
  function triggerFunction(fn) {
  	fn.apply(this,args);
  };

  if('forEach' in listeners) {
  	listeners.forEach(triggerFunction.bind(this));
  } else {
  	for(var i in listeners) {
  	  if(listeners.hasOwnProperty(i)) triggerFunction(fn);
  	}
  }

  return this;

};
},{}]},{},[1])
;