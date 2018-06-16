/**
 *        Hex Viewer for JsOS
 *    Copyright (c) PROPHESSOR 2018
 */

/* eslint-disable no-new */

'use strict';

const fs = require('fs');
const $ = require('../../core/graphics/jsmb-pseudo');
const { log, success, error, warn } = $$.logger;
const { TerminalError } = require('errors');

exports.call = (cmd, args, api, exit) => {
  let offset = 0; // Cursor offset in file
  let isFileOpened = false;
  let fileBuffer = null; // File buffer will be here

  const drawUI = () => {
    $
      .cls()
      // .setColor(0xF)
      // .drawRect(0, 0, $.screenWidth(), $.screenHeight())
      // .drawLine($.screenWidth() / 2, 0, $.screenWidth() / 2, $.screenHeight())
      .setColor(0x6)
      .drawString('Offset:', 2, $.screenHeight() - 2)
      .setColor(0xE)
      .drawString('Press F12 to exit', $.screenWidth() - 18, $.screenHeight() - 4)
      .repaint();
  };

  const render = () => {
    log('Trying to draw the buffer\'s content...', { level: 'app' });

    let offsetx = 2;
    let offsety = 2;

    $.setColor(0x2);

    let i = 0;

    for (const byte of fileBuffer) { // eslint-disable-line
      let symbol = byte.toString(16).toUpperCase();
      let offsetstr = offset.toString(); // TODO: DEC and HEX format

      if (i === offset) $.setBackColor(0xF);
      else $.setBackColor(0x0);

      if (symbol.length === 1) symbol = `0${symbol}`;
      if (offsetstr.length === 1) offsetstr = `0${offsetstr}`;

      $
        .drawString(symbol, offsetx, offsety)
        .setBackColor(0x0)
        .drawString(offsetstr, 10, $.screenHeight() - 2);
        // TODO: Display: Int8, UInt8, Int16, UInt16, Int32, UInt32, Symbol

      offsetx += 3;

      if (offsetx > $.screenWidth() - 3) {
        offsety += 2;
        offsetx = 2;
      }

      if (offsety > $.screenHeight() - 5) break;

      i++;
    }

    log('Repaint', { level: 'app' });
    $.repaint();
  };

  const stop = (code = 0) => {
    api.keyboard.onKeydown.remove(onKeyDown); // eslint-disable-line

    return exit(code);
  };

  const onKeyDown = (key) => {
    switch (key.type) {
      case 'f12':
        return stop(0);
      case 'kpleft':
        if (isFileOpened && offset > 0) {
          offset--;
          render();
        }
        break;
      case 'kpright':
        if (isFileOpened && offset < fileBuffer.length - 1) {
          offset++;
          render();
        }
        break;
      default:
        break;
    }
  };

  api.keyboard.onKeydown.add(onKeyDown);

  const argv = args.split(/\s+/);

  if (!argv[0]) {
    new TerminalError(`You didn't specify the file to read!`);

    return stop(1);
  }

  log('Trying to read the file...', { level: 'app' });

  fs.readFile(argv[0], (err, buffer) => {
    if (err) {
      error(`Error while file reading: ${err}`);
      new TerminalError(`Can't read the file!`);

      return stop(1);
    }

    isFileOpened = true;
    fileBuffer = buffer;

    success('OK!', { level: 'app' });

    drawUI();
    render();
  });
};

exports.commands = ['hexviewer'];
