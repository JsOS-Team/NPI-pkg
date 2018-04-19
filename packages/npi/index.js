// JsOS/NPI
// By Ivanq

'use strict';

const Package = require("./package");

function main(args, api, res) {
	const io = api.stdio;

	args = args.split(/\s+/);
	let cmd = args.shift();

	switch(cmd) {
		case "":
		case "help": {
			io.setColor("yellow");
			io.writeLine("JsOS/NPI - No Problem Installer");
			io.writeLine("Commands:");
			io.writeLine("help      Show command or subcommand help");
			io.writeLine("info      Show package info");
			return res(0);
		}

		case "f":
		case "info": {
			if(!args[0]) {
				io.setColor("red");
				io.writeLine("npi info: choose some package");
				return res(1);
			}

			const pkg = new Package(args[0]);
			pkg.getInfo()
				.then(info => {
					io.setColor("white");
					for(const key of Object.keys(info)) {
						let value = info[key];
						if(value === null) {
							value = "<null>";
						}

						io.writeLine(key + " ".repeat(10 - key.length) + value);
					}
					res(0);
				}, e => {
					io.writeError(e.message);
					res(1);
				});

			break;
		}

		case "i":
		case "install": {
			if(!args[0]) {
				io.setColor("red");
				io.writeLine("npi install: choose some package");
				return res(1);
			}

			const pkg = new Package(args[0]);
			pkg.install(io)
				.then(
					() => res(0),
					e => {
						io.writeError(e);
						res(1);
					}
				);

			break;
		}

		default: {
			io.setColor("red");
			io.writeLine("Unknown command");
			return res(1);
		}
	}
}

exports.call = (cmd, args, api, res) => main(args, api, res);

exports.commands = ["npi"];