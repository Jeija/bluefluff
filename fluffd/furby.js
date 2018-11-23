const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";

/*
Furby-Object that has its bluetooth-connection (fluff) to a Furby
and some actions a Furby can execute
 */
module.exports = class Furby {
	constructor(id, connection) {
		this._id = id;
		this._connection = connection;
		this._commands = {};
	}

	getId() {
		return this._id;
	}

	learn(commands) {
		for (var command in commands) {
			this._commands[command] = commands[command];
		}
	}

	do(cmd, params) {
		if (!this._commands[cmd]) {
			winston.log("error", "Command not found: " + cmd);
			throw "Command not found: " + cmd;
		} else {
			this._commands[cmd].run(this._connection, params);
		}
	}
};
