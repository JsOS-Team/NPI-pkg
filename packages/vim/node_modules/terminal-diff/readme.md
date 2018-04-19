#terminal-diff

A small library for handling the diffing that is useful for rendering applications on a terminal screen


var TerminalDiff = require('terminal-diff');

var tdiff = new TerminalDiff();

tdiff.on('reset',function(text) {
	var lines = text.split('\n');

	//Clear the screen for a redraw.
	screen.clear();

	//Write in line
	lines.forEach(function(content,lineIndex) {

		//Write the line to the screen
		screen.write({
			line: lineIndex,
			content: content
		});
	});
}); 

tdiff.on('update', function(diff) {
	diff.forEach(screen.write);
});
