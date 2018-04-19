var Term_diff = require('../index');

describe("Term_diff", function() {
	it('exists', function() {
		(typeof Term_diff).should.equal('function');
	});

	var td;

	beforeEach(function() {
		td = new Term_diff();
	});

	describe('text', function() {
		it('returns the current text', function() {
			td.textArray = ['asdf'];
			td.text().should.equal('asdf');
		});
	});
			

	describe('reset', function() {
		it('sets the textArray', function() {
			td.reset('asdf');
			td.text().should.equal('asdf');
		});
		it('triggers reset event', function() {
			var reset = false;
			td.on('reset', function() {
				reset = true;	
			});
			td.reset('hi');
			reset.should.equal(true);
		});	
		it('reset event carries text as arg', function() {
			var newText = '';
			td.on('reset', function(text) {
				newText = text;
			});
			td.reset('hi');
			newText.should.equal('hi');
		});	
	});	
	describe('update', function() {
		it('updates the text', function() {
			td.update('hello');
			td.text().should.equal('hello');
		});
		it('triggers an update event', function() {
			var update = false;
			td.on('update', function() {
				update = true;	
			});
			td.update('hello');
			update.should.equal(true);
		});
		it('update event carries an array with the diff', function() {
			var diff;
			td.on('update', function(newDiff) {
				diff = newDiff;
			});
			td.update('hello');
			diff[0].line.should.equal(0);
		});

	});


});
