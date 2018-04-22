// NetInfo application
// By ivan770

'use strict';

function main (cmd, args, api, res) {
  const io = api.stdio;

  if (args === 'interfaces'){
    const interfaces = require('../../core/net/interfaces');

    try {
      var arr = interfaces.getAll();
      arr.forEach(function (item, i, arr) {
        io.writeLine(i + ': ' + item.name);
      });
    } catch (err) {
      io.setColor('red');
      io.writeLine('Unable to get network interfaces');

      return res(1);
    }

  } else if (args === '') {
    io.setColor('red');
    io.writeLine('NetInfo testing tool.');
    io.writeLine('Created by ivan770');
    io.writeLine('');
    io.setColor('green');
    io.writeLine('interfaces - Get all network interfaces');
    io.writeLine('stats - Get network usage stats');
  } else if (args === 'stats') {
    const netstat = require('../../core/net/net-stat');

    try {
      var receiveCount = netstat.receiveCount;
      var transmitCount = netstat.transmitCount;
      io.writeLine(`'Receive: ${receiveCount}'`);
      io.writeLine(`'Transmit: ${transmitCount}'`);
    } catch (err) {
      io.setColor('red');
      io.writeLine('Unable to get network stats');

      return res(1);
    }
  } else {
    io.setColor('red')
    io.writeLine(`'Invalid argument : ${args}'`);

    return res(1);
  }

  return res(0);
}

exports.call = main;

exports.commands = ['netinfo'];
