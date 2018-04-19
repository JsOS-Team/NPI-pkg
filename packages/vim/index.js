'use strict';

const Vim = require('./js-vim');
let vim;
let kb;
let io;
let res;

const kbaliases = {
  'enter':     '\n',
  'tab':       '\t',
  'backspace': '\b',
  'space':     ' ',
  'escape':    'esc',
  'kpup':      'k', // '↑'
  'kpdown':    'j', // '↓'
  'kpleft':    'h', // '←'
  'kpright':   'l', // '→'
};

function keyboard (key) {
  if (key.type === 'kppagedown') {
    kb.onKeydown.remove(keyboard);

    return res(0);
  }

  if (key.type === 'character') {
    vim.exec(kbaliases[key.character] || key.character);
  } else if (kbaliases[key.type]) vim.exec(kbaliases[key.type]);
  else debug(`Ignoring ${key.type}`);

  return false;
}

function exit () {
  kb.onKeydown.remove(keyboard);
  res(0);
}

function main (api, cb) {
  vim = new Vim();

  require('./lib/commands')(vim, exit);

  kb = api.keyboard;
  io = api.stdio;
  res = cb;

  kb.onKeydown.add(keyboard);

  let previousLines = vim.view.getArray();

  io.clear();
  io.write(previousLines.join('\n'));

  vim.view.on('change', () => {
    const newLines = vim.view.getArray();

    for (let i = 0; i < newLines.length; i++) {
      if (newLines[i] != previousLines[i]) {
        // Line changed, redraw it
        io.moveTo(0, i);
        io.write(newLines[i]);
        if (newLines[i].length < previousLines[i].length) {
          io.write(' '.repeat(previousLines[i].length - newLines[i].length));
        }
      }
    }

    previousLines = newLines;
  });
}
exports.commands = ['vim'];
exports.call = (app, args, api, cb) => {
  main(api, cb);
};
