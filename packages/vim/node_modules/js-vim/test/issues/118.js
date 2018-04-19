var Vim = require('../../index');
var vim;
describe('#118: n should not throw an error if no search has been made before.', function() {
    beforeEach(function() {
        vim = new Vim();
        vim.text('asdf\nfdsa');
		vim.exec('n\n');
    });
});

