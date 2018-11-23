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
	constructor() {
		this._lastState = "";
		this._subscribers = {};
	}

	subscribe(what, callback) {
		let subscribers = this._subscribers[what];
		if (! subscribers) {
			subscribers = [];
		}
		this._subscribers[what] = subscribers;

		subscribers.push(callback);
	}


	changeState(data) {

		let binaryFoo = "";
		let changedBits = "";
		for (let i = 0; i < data.length; i++) {
			binaryFoo = binaryFoo + pad(data[i].toString(2), 8);
		}

		let pressed = "";
		for (let i = 0; i < binaryFoo.length; i++) {
			const bit = binaryFoo[i];
			if (bit === "1") {
				pressed = pressed + i + " ";
			}
			if (this._lastState[i] !== bit) {
				changedBits = changedBits + i + " ";
				this.notifySubscribers(i, bit);
			}

		}

		winston.log("info", "state [ " + changedBits + "] " + binaryFoo + " ( " + pressed + ")");

		this._lastState = binaryFoo;

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
		return this._lastState[mapping[what]] === "1";
	}

	isOff(what) {
		return ! this.isOn(what);
	}
};
