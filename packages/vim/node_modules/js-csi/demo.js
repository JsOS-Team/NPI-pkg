var CSI = require('./index');

CSI.clear();

var message = '...............';

CSI.hide();

var length = 0;
var dir = 1;
setInterval(function() {
	if(length === message.length) {
		dir = -1;
	} else if(length === 0) {
		dir = 1;
	}
	length += dir;
	CSI.clear();
	CSI.move(0);
	var mess = message.substring(0,length);
  while(mess.length) {
		var letter = mess.substring(mess.length-1)
		CSI.move(mess.length,mess.length);
		CSI.write(letter);
		CSI.move(mess.length);
		CSI.write(letter);
		CSI.move(1,mess.length);
		CSI.write(letter);
		mess = mess.substring(0,mess.length-1);
		CSI.move(Math.floor(Math.random()*10),Math.floor(Math.random()*10))
		CSI.write('.');
	}
},100);


