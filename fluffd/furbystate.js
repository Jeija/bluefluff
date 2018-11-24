const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";


function pad(num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
}


const mapping = {
	"SCHWANZ" : 19,
	"ZUNGE" : 18,
	"ANTENNE_LINKS" : 14,
	"ANTENNE_RECHTS" : 15,
	"ANTENNE_HINTEN" : 16,
	"ANTENNE_VORNE" : 17,
	"STREICHELN" : 21,
	"KIPPEN_LINKS" : 32,
	"KIPPEN_RECHTS" : 33,
	"KIPPEN_HINTEN" : 34,
	"KIPPEN_VORNE" : 35,
};

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
				changedBits = changedBits + i + " ";
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
