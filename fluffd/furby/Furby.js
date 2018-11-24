const winston = require("winston");
const FurbyState = require("./Furbystate");

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

		this._state = new FurbyState(connection);

		this._subscriptions = {};
	}

	addBehaviour(behaviour) {
		behaviour.startBehaviour(this);
	}

	removeBehaviour(behaviour) {
		behaviour.stopBehaviour(this);
	}

	addEventListener(what, callback) {
		const furby = this;
		const subscription = data => callback(furby, data);
		this._state.subscribe(what, subscription);

		this._subscriptions[callback] = subscription;
	}

	removeEventListener(what, callback) {
		const subscription = this._subscriptions[callback];
		if (! subscription) {
			winston.warn("no subscription for given callback present");
			return;
		}

		this._state.unsubscribe(what, subscription);
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

	isOn(what) {
		return this._state.isOn(what);
	}

	isOff(what) {
		return this._state.isOff(what);
	}
};
