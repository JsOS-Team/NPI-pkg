// NetInfo application
// By ivan770

'use strict';

function main (cmd, args, api, res) {
  const io = api.stdio;

  io.setColor('red');
  io.writeLine('NetInfo testing tool.');
  io.writeLine('Created by ivan770');
  io.setColor('green');
  io.writeLine(`interfaces - Get all network interfaces`);

  return res(0);
}

const interfaces = {
  description: 'Get available network interfaces',
  usage: 'interfaces',
  run (suffix, api, res) {

    const interfaces = require('../../core/net/interfaces');
    const io = api.stdio;

    try {
      var arr = interfaces.getAll();
    } catch (err) {
      return res(1);
    }

    arr.forEach(function(item, i, arr) {
      io.writeLine(i + ": " + item.name);
    });

    return res(0);
  },
};

$$.shell.setCommand('interfaces', interfaces);

exports.call = main;

exports.commands = ['netinfo'];
