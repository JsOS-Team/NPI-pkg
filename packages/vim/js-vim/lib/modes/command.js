const _ = require('underscore');

module.exports = {

  '/^{count}{motion}$/' (count, motion) {
    while (count--) {
      this.exec(motion);
    }
  },


  /*	'/^{operator}{operator}$/': function(op1,op2) {
		this.exec(op1 + op2);
	},*/

  '/^{count}{operator}{count}{motion}$/' (ct1, operator, ct2, motion) {
    const count = ct1 * ct2;

    this.exec(count + operator + motion);
  },

  '/^{operator}{motion}$/' (operator, motion) {
    this.exec(`1${operator}${motion}`);

  },

  /*

		Oh boy, this is the big one.

	*/
  '/^{count}{operator}{motion}$/' (count, operator, motion) {
    this.addUndoState();

    let visualMode = 'v';

    // Certain ops assume you're in visual line mode
    if (motion.match(/gg|G|j|k|-|\+/)) {
      visualMode = 'V';
    }


    // See http://vimdoc.sourceforge.net/htmldoc/motion.html#operator
    if (operator === 'd' || operator === 'c') {
      if (motion === 'w') motion = 'e';
    }

    const position = this.curDoc.cursor.position();

    this.exec(visualMode);
    this.exec(motion);
    this.exec(operator);
  },


  // Text object selection
  '/^(y|d|c)(i|a)(w|W|s|S|p|\\]|\\[|\\(|\\)|b|>|<|t|\\{|\\}|"|\'|`)$/' (keys, vim, match) {
    this.exec('v');
    this.exec(match[2] + match[3]);
    this.exec(match[1]);
  },


  /**


	MOTIONS: (t|T|f|F)(\S)


	*/


  '/\g_/' (keys, vim) {
    this.exec('$');
    const doc = this.curDoc;
    const point = doc.find(/([\S])( |$)/g, { 'backwards': true }); // backwards

    if (point) {
      doc.cursor.line(point.line);
      doc.cursor.char(point.char);
    }
  },

  '/^gv$/' () {},

  '/^(b|B)/' (keys, vim) {
    const doc = this.curDoc;
    const point = doc.find(/(\S*)\s*(?=[\S]*)$/g, { 'backwards': true });

    if (point) {
      doc.cursor.line(point.line);
      doc.cursor.char(point.char); // oh ho
    }
  },


  '/^\\$$/' (keys, vim) {
    const curLine = this.curDoc.line();
    let cursorPos = 0;

    if (curLine.length) {
      cursorPos = curLine.length - 1 + (this.curDoc.selecting ? 1 : 0);
    }
    this.cursor().char(cursorPos);
  },

  /* go to beginning of line */
  '/^0$/' (keys, vim) {
    this.cursor().char(0);
  },

  /* go to next word */
  '/^(w)$/' (keys, vim) {
    const doc = this.curDoc;

    let point;

    if (!this.curChar.match(/\s/)) {
      if (this.curChar.match(/\w/)) {
        point = doc.find(/(?:(?: |^)(\S)|([^\w^\s]))/g);
      } else {
        point = doc.find(/(?:(?: |^)([^\w^\s])|(\w))/g);
      }
    } else {
      point = doc.find(/(\S)/g);
    }

    if (point) { // there is a space, therefore a word
      doc.cursor.line(point.line);
      doc.cursor.char(point.char);
    }
  },

  /* go to next WORD */
  '/^(W)$/' (keys, vim) {
    const doc = this.curDoc;
    const point = doc.find(/(?: |^)(\S+)/g);

    if (point) { // there is a space, therefore a word
      doc.cursor.line(point.line);
      doc.cursor.char(point.char);
    }

  },

  /* go to end of this word */
  '/^(e)$/' (keys, vim) {
    const doc = this.curDoc;
    const point = doc.find(/(\w)(?= |$|\n)/g);

    if (point) { // there is a space, therefore a word
      doc.cursor.line(point.line);
      doc.cursor.char(point.char); // oh ho
    }
  },

  /* go to first non-whitespace character of this line */
  '/\\^/' (keys, vim) {
    this.exec('0');
    const doc = this.curDoc;

    if (this.curChar.match(/(\S)/g) === null) {
      // if the first character is whitespace, seek another
      const point = doc.find(/(\S)/g);

      if (point) {
        doc.cursor.line(point.line);
        doc.cursor.char(point.char);
      }
    }
  },

  /* *)* sentences forward. */
  '/^\\)$/' () {
    const pt = this.curDoc.find(/(?:^|\. )(.)/g);

    if (pt) this.curDoc.cursor.position(pt);
  },

  /* *(* sentences backward. */
  '/^\\($/' () {
    // If mid-sentence
    var pt = this.curDoc.find(/(?:\.|\?|\!) ([\w\s]+)(?:$)/g, { 'backwards': true });

    if (!pt.found) {
      // If A middle sentence
      var pt = this.curDoc.find(/(?:\.|\?|\!) ([\w\s]+)(?:(?:\.|\?|\!)|$)/g, { 'backwards': true });
    }
    if (!pt.found) {
      // If first sentence of line.
      var pt = this.curDoc.find(/(?:^|(?:\.|\?|\!) )([\w\s]+)(?:(?:\.|\?|\!)|$)/g, { 'backwards': true });
    }

    // If previous sentence is not at beginning
    // var pt = this.curDoc.find(/(?:\. )(\w*?)(?:$|\. )?/g, { backwards: true });
    // If previous sentece IS the beginning
    if (pt) this.curDoc.cursor.position(pt);
  },


  /* Basic movement */

  '/^h$/' (keys, vim) {
    const newChar = this.cursor().char() - 1;

    if (newChar < 0) return;
    this.cursor().char(newChar);
  },

  '/^l$/' (keys, vim) {
    const newChar = this.cursor().char() + 1;

    if (!this.curDoc.selecting && newChar >= this.curDoc.line().length) return;

    this.cursor().char(newChar);
  },

  '/^j$/' (keys, vim) {
    const newLine = this.cursor().line() + 1;

    if (newLine >= this.curDoc._lines.length) return;
    this.cursor().line(newLine);
  },

  '/^k$/' (keys, vim) {
    const newLine = this.cursor().line() - 1;

    if (newLine < 0) return;
    this.cursor().line(newLine);
  },

  '/^([1-9]+[0-9]*)$/' (keys, vim, res) {
    this.keyBuffer += keys;
  },

  /* Go to line */
  '/^([1-9][0-9]*)G$' (keys, vim, res) {

    // Zero indexed but referenced one-indexed
    let lineNumber = parseInt(res[1]) - 1;

    // Move line
    if (this.curDoc._lines.length <= lineNumber) {
      lineNumber = this.curDoc._lines.length - 1;
    }
    this.curDoc.cursor.line(lineNumber);
    // Go to the beginning
    this.exec('0');
  },

  /* go to first line */
  '/^gg$/' (keys, vim, res) {
    this.exec('1G');
  },

  /* go to last line */
  '/^G$/' (keys, vim, res) {
    this.exec(`${String(this.curDoc._lines.length)}G`);
  },


  '/^f(.)$/' (keys, vim, match) { // convert to: f([\w])
    const lastSearch = this.curDoc.last('search');

    this.exec(`/${match[1]}\n`);
    this.curDoc.last('f', `f${match[1]}`);
    this.curDoc.last('search', lastSearch);
  },


  '/^F(.)$/' (keys, vim, match) { // convert to: f([\w])
    const lastSearch = this.curDoc.last('search');

    this.exec(`?${match[1]}\n`);
    this.curDoc.last('f', `F${match[1]}`);
    this.curDoc.last('search', lastSearch);
  },


  '/^t(.)$/' (keys, vim, match) { // convert to: f([\w])
    const lastSearch = this.curDoc.last('search');

    this.exec('l');
    this.exec(`/${match[1]}\n`);
    this.exec('h');
    this.curDoc.last('f', `t${match[1]}`);
    this.curDoc.last('search', lastSearch);
  },


  '^T(.)$' (keys, vim, match) { // convert to: f([\w])
    const lastSearch = this.curDoc.last('search');

    this.exec('h');
    this.exec(`?${match[1]}\n`);
    this.exec('l');
    this.curDoc.last('f', `T${match[1]}`);
    this.curDoc.last('search', lastSearch);
  },


  '/^;$/' (vim) {
    this.exec(this.curDoc.last('f'));
  },

  '/^,$/' (vim) {
    const last = this.curDoc.last('f');
    let lastOp = last.substring(0, 1);

    if (lastOp === lastOp.toLowerCase()) {
      lastOp = lastOp.toUpperCase();
    } else {
      lastOp = lastOp.toLowerCase();
    }
    this.exec(lastOp + last.substring(1));
    this.curDoc.last('f', last);
  },


  '/^(\\/|\\?)(.*)\\n/' (keys, vim, match) {

    this.curDoc.last('search', keys);

    this.searchMode = match[1] === '/' ? 'forwards' : 'backwards';
    if (match[2].length) {
      this.searchBuffer = match[2];
      if (match[2].match(/"[a-z]/)) {
        this.searchBuffer = this.register(match[2].substring(1));
      }
    }
    const pt = this.curDoc.find(new RegExp(`(${this.searchBuffer.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')})`, 'g'), {
      'selection': true,
      'backwards': vim.searchMode === 'backwards',
    });

    if (pt) {
      this.cursor().line(pt.line);
      this.cursor().char(pt.char);
    }
  },

  /* '/^(\\/)/': function(keys,vim) {
		this.searchMode = 'forward';
		this.keyBuffer = '';
		this.mode('search');
	},*/

  '/^n$/' (keys, vim, res) {
    this.exec(this.curDoc.last('search'));
  },

  '/^N$/' (keys, vim, res) {
    const last = this.curDoc.last('search');

    if (!last) return;
    if (last.substring(0, 1) === '?') {
      newLast = `/${last.substring(1)}`;
    } else {
      newLast = `?${last.substring(1)}`;
    }
    this.exec(newLast);
    this.curDoc.last('search', last);
  },


  // MODES

  '/(esc)/' (keys, vim) {
    this.keyBuffer = '';
  },

  // Insert mode
  '/^(i|s|S)/' (keys, vim) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    // this.exec('h');
    if (!this.curDoc._lines.length) {
      this.curDoc._lines.push('');
    }
    this.currentInsertedText = '';
    this.insertSession = '';
    this.mode('insert');
  },

  '/^(A)$/' (keys, vim) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('$');
    this.exec('a');
  },

  '/^(I)/' (keys, vim) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('0');
    this.exec('i');
  },

  '/^v$/' (keys, vim) {
    const pos = this.curDoc.cursor.position();

    this.rangeStart = this.rangeEnd = pos;
    this.mode('visual');
  },

  '/^V$/' (keys, vim) {
    this.submode = 'Visual';
    this.exec('v');
  },

  '/^<Ctrl-v>$/' () {
    this.submode = 'block';
    this.exec('v');
  },


  /* join */
  '/^J$/' (keys, vim) {
    this.exec('j');
    this.exec('0');
    this.exec('v');
    this.exec('$');
    this.exec('d');

    // Doing this rather than go to greater measures to delete the line.
    let copied = this.register(0);

    copied = copied.substring(0, copied.length - 1);
    this.register(0, copied);

    this.exec('k');
    this.exec('$');
    const position = this.curDoc.cursor.char();

    this.exec('a');
    this.exec(' ');
    this.exec(copied);
    // this.exec('p');
    this.exec('esc');
    //		this.curDoc.cursor.char(position);
    this.curDoc.selection('reset');
    this.exec('0');
    this.exec(`${position + 1}l`);
  },

  '/^o$/' (keys, vim) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('A');
    this.exec('\n');
  },

  '/^O$/' (keys, vim) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('0');
    this.exec('i');
    this.exec('\n');
    this.exec('esc');
    this.exec('k');
    this.exec('i');
  },
  '/^a$/' (keys, vim) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('i');
    const doc = this.curDoc;

    doc.cursor.char(doc.cursor.char() + 1);
  },

  '/^([1-9]+[0-9]*)?(yy|cc|dd)$/' (keys, vim, match) { // number
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    const start = this.curDoc.cursor.position();

    this.exec('0');
    this.exec('v');
    let ct = 1;
    let to = parseInt(match[1]);

    if (!to) to = 1;
    while (ct < to) {
      ct++;
      this.exec('j');
    }
    this.exec('$');


    let text = this.curDoc.getRange(this.curDoc.selection());

    if (text.substring(text.length - 1) === '\n') text = text.substring(0, text.length - 1);
    this.curDoc.yanking = false;

    if (match[2] === 'cc' || match[2] === 'dd') {
      this.exec('d');
    }

    this.curDoc.cursor.line(start.line);
    this.curDoc.cursor.char(start.char);


    if (match[2] === 'cc') {
      this.exec('i');
    }
    const command = ['o', text, 'esc'];

    if (to >= 2) {
      command.push(`${to - 1}k`);
    }
    command.push('0');

    this.register(this.currentRegister, command);
    this.curDoc.yanking = false;

  },


  /* Set current register */
  '/^"([-a-z%\.\-_\"#])$/' (keys, vim, match) {
    this.currentRegister = match[1];
  },


  /* paste / put after cursor */
  '/^(p|P)$/' (keys, vim, match) {
    const P = match[1] === 'P';
    const reg = this.register(this.currentRegister || 0);

    // Don't execute nothing
    if (!reg || !reg.length) return;

    // Execute arrays as a sequence of commands
    if (_(reg).isArray()) {
      while (reg.length) {
        this.exec(reg.shift());
      }
      this.exec('esc');
    } else {
      // Otherwise treat as text
      this.exec(P ? 'i' : 'a');
      this.exec(reg);
      this.exec('esc');
    }

  },

  '/^(P)/' (keys, vim, res) {
    this.exec('i');
    this.exec(this.register(0));
    this.exec('esc');
  },


  /* Begin recording into specified registry */
  '/^q([a-z]?)$/' (keys, vim, res) {
    if (this.recording) {
      this.register(this.recordingRegister, this.recordingBuffer);
      this.recording = false;
    } else if (res[1]) {
      this.recording = true;
      this.recordingRegister = res[1];
      this.recordingBuffer = [];
      this.preRecordText = this.curDoc.text();
    } else {
      this.keyBuffer = 'q';
    }
    // grab the doc in a diff
    // this.mode('recording');
  },


  /* End the recording if currently recording */
  /* '/^q$/': function(keys,vim) {
		if(this.recording) {
			this.recording = false;
			this.curDoc.text(vim.preRecordText);
		}
	},*/

  /* Execute the command as stored in the register */
  '/^@([a-z])$/' (keys, vim, res) {
    const commands = this.register(res[1]);

    this.curDoc.last('macro', res[1]);
    if (typeof commands === 'string') {
      this.exec(commands);
    } else {
      while (commands.length) {
        this.exec(commands.shift());
      }
    }
  },

  '/^@@$/' () {
    const last = this.curDoc.last('macro');

    if (last) {
      this.exec(`@${last}`);
    }
  },

  /* '/([0-9]+)([hHjJkKlLwWbBeE(){}]|yy|dd|\[\[|\]\]|)/': function(keys,vim,result) {
		var ct = result[1];
		var command = result[2];
		while(ct--) this.exec(command);
	}*/

  /* REPLACE */

  '/^r(.)$/' (keys, vim, match) {
    this.exec('x');
    this.exec('i');
    this.exec(match[1]);
    this.exec('esc');
  },

  /* SHORTCUTS */


  /* Commands that can be stupidly executed N times, instead of a smarter visual selection */
  '/^([1-9]+[0-9]*)(x|X)$/' (keys, vim, match) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    let ct = parseInt(match[1]);

    while (ct--) {
      vim.exec(match[2]);
    }
  },

  '/^x$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    // Using x, don't delete a line if it's empty.
    const range = this.curDoc.selection();

    if (range[0].line === range[1].line & !this.curDoc.line(range[0].line).length) {
      return;
    }

    // Grab a hold of something
    this.exec('v');

    // Otherwise treat as d
    this.exec('d');
  },
  '/^X$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('h');
    this.exec('x');
  },
  '/^D$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('d');
    this.exec('$');
  },
  '/^C$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('c');
    this.exec('$');
  },
  '/^s$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('c');
    this.exec('l');
  },
  '/^S$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      this.addUndoState();
    }
    this.exec('c');
    this.exec('c');
  },

  '/^u$/' (keys, vim, res) {
    if (this.execDepth === 1) {
      if (this.addUndoState()) {
        // quick undo to get back to current state just recorded.
        this.curDoc.undo.last();
      }
    }
    const state = this.curDoc.undo.last();

    if (!state) return;
    this.curDoc.text(state.text);
    this.curDoc.cursor.char(state.cursor.char);
    this.curDoc.cursor.line(state.cursor.line);
  },

  '/<C-r>/' (keys, vim, res) {
    const state = this.curDoc.undo.next();

    if (!state) return;
    this.curDoc.text(state.text);
    this.curDoc.cursor.char(state.cursor.char);
    this.curDoc.cursor.line(state.cursor.line);
  },

  /*	'/:([^w^q]*)\n/': function(exCommand) {
		this.keyBuffer = '';
		this.exec('esc');
	},
*/

  '/:say (.*)\\n/' (exCommand) {
    this.notify('hey!');
  },

  '/:(.*)↑/' () {
    const hist = this.histories[':'];
    let pos = hist.position;

    if (pos > 0) pos--;
    this.histories[':'].position = pos;
    this.keyBuffer === '';
    this.exec(':');
    this.exec(hist[pos]);
  },
  '/:(.*)↓/' () {
    const hist = this.histories[':'];
    let pos = hist.position;

    if (pos > hist.length - 1) pos = hist.length - 1;
    if (pos < hist.length - 1) pos++;
    this.histories[':'].position = pos;
    this.keyBuffer === '';
    this.exec('esc');
    this.exec(':');
    this.exec(hist[pos]);
  },

  '/^:abbreviate (.*?) (.*)\n$/' (keys, vim, expr) {
    const key = expr[1];
    const val = expr[2];

    this.rc.abbreviations[key] = val;
  },

  '/^:ab (.*?) (.*)\n$/' (keys) {
    this.exec(keys.replace(/:ab/, ':abbreviate'));
  },

  '/^~$/' () {
    const curChar = this.curChar;

    this.exec('r');
    this.exec(this.curChar === this.curChar.toLowerCase() ? this.curChar.toUpperCase() : this.curChar.toLowerCase());
    this.exec('esc');
  },

  /* complement */
  '/^%$/' () {
    const pos = this.curDoc.cursor.position();
    const table = {
      '{': '}',
      '}': '{',
      '(': ')',
      ')': '(',
      'f': 'F',
      'F': 'f',
    };
    const seeking = table[this.curChar];
    const verb = '{('.indexOf(this.curChar) > -1 ? 'f' : 'F';

    this.exec(verb + seeking);
    this.exec(table[verb] + table[seeking]);
    let ct = 1;
    // While the previous calisthenics don't return you home
    let last = false;

    while (pos.char !== this.curDoc.cursor.char() || pos.line !== this.curDoc.cursor.line()) {
      if (last) {
        this.curDoc.cursor.line(pos.line);
        this.curDoc.cursor.char(pos.char);

        return;
      }
      this.curDoc.cursor.line(pos.line);
      this.curDoc.cursor.char(pos.char);
      if (ct > 10) throw 'recursion in complement seeking';
      // Endeaver to go farther
      ct++;
      this.exec(String(ct) + verb + seeking);
      last = this.curDoc.cursor.line() === this.curDoc._lines.length - 1 && this.curDoc.cursor.char() >= this.curDoc._lines[this.curDoc.cursor.line()].length - 1;
      this.exec(String(ct) + table[verb] + table[seeking]);
    }
    this.exec(String(ct) + verb + seeking);
  },

  /* Mark */
  '/^m([a-z\.])$/' (keys, vim, expr) {
    const pos = this.curDoc.cursor.position();
    const mark = {
      'col':  pos.char,
      'line': pos.line,
      'file': this.curDoc.path || '',
      'mark': expr[1],
    };

    this.curDoc.addMark(mark);
  },

  /* Go to mark */
  '/^(\'|`)([a-z\.<>])$/' (keys, vim, expr) {
    const markName = expr[2];

    if (markName in this.curDoc._marks) {
      const docMark = this.curDoc._marks[markName];
      const mark = this.curDoc.getMark(expr[2]);

      if (mark) {
        this.curDoc.cursor.line(mark.line);
        if (expr[1] === '`') {
          this.curDoc.cursor.char(mark.col);
        } else {
          this.exec('0');
        }

        return;
      }
    }
    this.notify('E20: Mark not set');
  },

};
