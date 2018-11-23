const winston = require("winston");
const FurbyState = require("./furbystate");

winston.level = process.env.LOG_LEVEL || "debug";


function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}

function pad2(num, size) {
	var s = "        " + num;
	return s.substr(s.length-size);
}


/*
Furby-Object that has its bluetooth-connection (fluff) to a Furby
and some actions a Furby can execute
 */
module.exports = class Furby {
	constructor(id, connection) {
		winston.log("info", "my id is " + id);
		this._id = id;
		this._connection = connection;
		this._commands = {};

		this._connection.subscribe((data) => this.onNotification(data));
		this._state = new FurbyState();
		this._state.subscribe("SCHWANZ", (state) => this.schwanzToggle(state));
		this._state.subscribe("ZUNGE", (state) => this.zungeToggle(state));


	}


	onNotification(data) {
		this._state.changeState(data);
	}

	schwanzToggle(state) {
		this.do("antenna", { green: state? 255:0, red: 0, blue: 0 })
	}

	zungeToggle(state) {
		this.do("antenna", { red: state? 255:0, green: 0, blue: 0 })
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
