const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";


function pad(num, size) {
	var s = "000000000" + num;
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
		this._antennaPressed = false;

		this._connection.subscribe((data) => this.onNotification(data));
	}

	hexToBin(hex) {

		const bytes = [];
		for(var i=0; i< hex.length-1; i+=2){
			bytes.push(parseInt(hex.substr(i, 2), 16));
		}

		return String.fromCharCode.apply(String, bytes);

	}

	onNotification(data) {

		let binaryFoo = "";
		for (let i = 0; i < data.length; i++) {
			binaryFoo = binaryFoo + pad(data[i].toString(2), 8);
		}

		winston.log("info", "state changed " + binaryFoo);
	}

	pressAntenna() {
		winston.log("info", "antenna is pressed");
	}

	releaseAntenna() {
		winston.log("info", "antenna is release");
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
