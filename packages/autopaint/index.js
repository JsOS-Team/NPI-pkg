/**
 *        Autopaint for JsOS
 *    Copyright (c) PROPHESSOR 2018
 */

'use strict';

const $ = require('../../core/graphics/jsmb-pseudo');

exports.call = (cmd, args, api, exit) => {
  const [SCW, SCH] = [$.screenWidth(), $.screenHeight()];
  let [x, y] = [SCW / 2, SCH / 2];

  const render = () => {
    const direction = $.random(0, 100);

    if (direction < 25 && y > 0) y--;
    else if (direction < 50 && x < SCW) x++;
    else if (direction < 75 && y < SCH) y++;
    else if (x > SCW / 2) x--;

    $
      .setColor($.random(0, 0xF))
      .drawString('#', x, y)
      .drawString('#', SCW - x, y)
      .repaint();
  };

  const timer = setInterval(render, 50);

  const onKeyDown = (key) => {
    if (key.type === 'f12') {
      clearInterval(timer);
      api.keyboard.onKeydown.remove(onKeyDown);

      return exit(0);
    }
  };

  api.keyboard.onKeydown.add(onKeyDown);

  $
    .cls()
    .setColor(0xE)
    .drawString('Welcome to Autopaint app! Press F12 to exit.', 0, 0);
};

exports.commands = ['autopaint'];
