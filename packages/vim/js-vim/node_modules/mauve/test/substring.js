var mauve = require('..');

describe('mauve.substring', function() {
	it('should act like substring', function() {
		var x = 'asdf';
		var y = x.substring(1,3);
		y.should.equal('sd')
	});

	it('Should return empty if string is zero length', function() {
		var x = 'asdf';
		var y = x.substring(0,0);
		y.should.equal('')
	});

	it('should accept the lack of an end to indicate to go to the end of the string', function() {
			'asdf'.substring(1).should.equal('sdf');
			'asdfdsa'.substring(1).should.equal('sdfdsa');

	});	

	it('should also work when modifiers are present', function() {
		mauve.set({'hello':'#000000'});
		var x = 'asdf'.hello;
		var y = x.substring(1,3);
		y.should.equal('sd'.hello);
	});

});
