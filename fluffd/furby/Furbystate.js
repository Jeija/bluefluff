const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";


function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}


const mapping = {
	"ACTION_IN_PROGRESS" : 12,
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
				this.notifySubscribers(i, bit);
			}

		}

		winston.log("info", "state [ " + changedBits + "] " + bitmaskString + " ( " + pressed + ")");

		this._lastBitmaskString = bitmaskString;

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
