const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";


function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}


const mapping = {
	"ACTION_IN_PROGRESS" : 0,
	"TAIL" : 19,
	"TONGUE" : 18,
	"ANTENNA_LEFT" : 14,
	"ANTENNA_RIGHT" : 15,
	"ANTENNA_BACK" : 16,
	"ANTENNA_FRONT" : 17,
	"PET_RIGHT" : 21,
	"PET_LEFT" : 22,
	"FORHEAD" : 23,
	"TILT_LEFT" : 32,
	"TILT_RIGHT" : 33,
	"TILT_BACK" : 34,
	"TILT_FRONT" : 35,
};

function bitToWhat(bit) {
	for (let what in mapping) {
		if (mapping[what] === bit) {
			return what;
		}
	}
}

module.exports = class FurbyState {
	constructor(connection) {
		this._connection = connection;
		this._lastBitmaskString = pad(0, "64");
		this._subscribers = {};

		this._connection.subscribe((data) => this.onNotification(data));
	}

	onNotification(data) {
		const firstByte = data[0].toString(16);
		if (firstByte === "21" ) {
			this.processSensorData(data);
			return;
		}
		if (firstByte === "20" ) {
			this.processFurbyMessage(data);
			return;
		}

		let bitmaskString = "";
		for (let i = 0; i < data.length; i++) {
			bitmaskString = bitmaskString + pad(data[i].toString(2), 8);
		}

		winston.log("info", "other response [ " + firstByte + "] " + bitmaskString);
	}

	processSensorData(data) {
		let bitmaskString = "";
		let changedBits = "";
		for (let i = 0; i < data.length; i++) {
			bitmaskString = bitmaskString + pad(data[i].toString(2), 8);
		}

		let pressed = "";
		for (let i = 0; i < bitmaskString.length; i++) {
			const bit = bitmaskString[i];
			if (bit === "1") {
				pressed = pressed + i + " ";
			}
			if (this._lastBitmaskString[i] !== bit) {
				changedBits = changedBits + (bitToWhat(i) || i) + "="+bit+ " ";
			}
		}
		winston.log("info", "sensor data [ " + changedBits + "] " + bitmaskString + " ( " + pressed + ")");

		for (let i = 0; i < bitmaskString.length; i++) {
			const bit = bitmaskString[i];
			if (this._lastBitmaskString[i] !== bit) {
				this.notifySubscribers(i, bit);
			}

		}

		this._lastBitmaskString = bitmaskString;
	}


	processFurbyMessage(data) {
		const byte = data[1].toString(16);
		if (byte === "c") {
			winston.log("info", "furby message: sequence starting");
		} else if (byte === "e") {
			winston.log("info", "furby message: sequence ending");
		} else if (byte === "7") {
			winston.log("info", "furby message: sequence not started because there is one playing");
		} else {
			winston.log("info", "furby message: " + byte);
		}
	}


	subscribe(what, callback) {
		let subscribers = this._subscribers[what];
		if (! subscribers) {
			subscribers = [];
			this._subscribers[what] = subscribers;
		}

		subscribers.push(callback);
	}

	unsubscribe(what, callback) {
		let subscribers = this._subscribers[what];
		if (subscribers) {
			this._subscribers[what] = subscribers.filter(function(subscriber) {
				return subscriber !== callback
			});
		}
	}

	notifySubscribers(bitIndex, bit) {
		for (let what in mapping) {
			if (mapping[what] === bitIndex) {
				const subsrcibers = this._subscribers[what] || [];
				subsrcibers.forEach(s => {
					s(bit === "1");
				});
			}
		}
	}

	isOn(what) {
		return this._lastBitmaskString[mapping[what]] === "1";
	}

	isOff(what) {
		return ! this.isOn(what);
	}
};
