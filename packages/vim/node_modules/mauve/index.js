var hex2rgbString = require('rgb'),
	x256 = require('x256'),
	rgbRegExp = /(\d+),(\d+),(\d+)/;

/*
	mauve does colors stuff, but with less error checking + all 256 xterm colors rendered from hex
*/

var mauve;

function getPrefix(scheme) {
	//Handle the CSS here TODO: bold
	return '<span style="' +
		(scheme.fg ? 'color:' + scheme.fg +';': '') +
		(scheme.bg ? 'background-color:' + scheme.bg +';': '') +
		(scheme.misc ? 'font-weight:700;': '') +
		'">';
}

mauve = function(raw) {
	var freshString = new String(raw);
	if(typeof window !== 'undefined' || !document.getElementsById('terminals')) {
    for(var scheme in mauve.hash) {
      freshString[mauve.hash[scheme].name] = new String(getPrefix(mauve.hash[scheme]) + raw + "</span>");
      freshString[mauve.hash[scheme].name].substring = function() {
        return getPrefix(mauve.hash[scheme]) + raw.substring.apply(raw,arguments) + "</span>";	
      };
    }
	}
	return freshString;
}

mauve.hash = {};

mauve.set = function(name,color) {


// Pass k, v of item name and ideal color
	//Allow setting via a hash, i.e. "set theme"
	if(typeof name === 'object') {
		for(var i in name) {
			this.set(i,name[i]);
		}
		return;
	}

	var scheme = {};

	var fg = false;
	var bg = false;
	var misc = false;
	if(color.indexOf('#') > -1) {
		var colors = color.split('/');
		var fg = colors[0].length ? hex2Address(colors[0]) : false;
		scheme.fg = colors[0];
		var bg = colors[1] ? hex2Address(colors[1]) : false;
		scheme.bg = colors[1];
		this.hash[name] = scheme
		this.hash[name].name = name;
	} else {
		switch(color) {
			case 'bold':
				misc = '\u001B[1m';
				this.hash[name] = { misc: 'bold', name: name };
				break;
		}
	}

	//In node, ammend this TODO: kill this in favor of above strategy.
	if(typeof window === 'undefined' || document.getElementById('terminals') ) { //node or substack unix


		//When called, overwrite the substring method to ignore the added characters
	String.prototype.substring = function(start,end) {
			if(start === end) return '';
			if(!end) end = this.length;
			var text = '';
			var raw = this.split('');
			var index = 0;
			var inEscape = false;
			var curChar;
			var currentCommand = '';
			while(index < start) {
				curChar = raw.shift();
				if(inEscape) {
					currentCommand += curChar;
					if(curChar === 'm') {
						inEscape = false;
					}
					continue;
				} else {
					if(curChar === '\u001B') {
						inEscape = true;
						currentCommand = curChar;
						continue;
					}
					index++;
				}
			}	

			//If there is current formatting, apply it.
			if(currentCommand !== '\u001B[0m') {
				text += currentCommand;
			}	

			while(index < end && raw.length) {

				curChar = raw.shift();
				text += curChar;
				if(inEscape) {
					if(curChar === 'm') {
						inEscape = false;
					}
					continue;
				} else {
					if(curChar === '\u001B') {
						inEscape = true;
						continue;
					}
				}
				index++;
			}
			return text;
		};

	
	String.prototype.__defineGetter__(name,function() {
		var raw = this.replace(/\u001B(?:.*)m/,'');
		var result = '';
		if(fg) result += '\u001B[38;5;' + fg + 'm';
		if(bg) result += '\u001B[48;5;' + bg + 'm';
		if(misc) result += misc;
		result += raw + '\u001B[0m';
		return result;
	});
	}
};

function hex2Address(hex) {
	var rgb = hex2rgbString(hex);
	var nums = rgbRegExp.exec(rgb);
	return x256(parseInt(nums[1]),parseInt(nums[2]),parseInt(nums[3]));
}


module.exports = mauve;
