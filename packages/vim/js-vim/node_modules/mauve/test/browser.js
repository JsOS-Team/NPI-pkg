var mauve = require('../index');


mauve.set({
	happy: "#c02",
	lucky: "#333"
});

describe('mauve()', function() {
	it('augments a string', function() {
		var message = 'hello';
		var augmented = mauve(message);	
		augmented.happy.should.equal('<span style="color:#c02">hello</span>');
	});
	it('the added properties should have an appropriate substring', function() {
		var message = 'hello';
		var augmented = mauve(message);	
		augmented.lucky.substring(0,1).should.equal('<span style="color:#333">h</span>');

	});
});
