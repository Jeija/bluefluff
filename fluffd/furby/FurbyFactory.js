const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";
const HackatonBehaviour = require("../behaviour/hackatonBehaviour");
const RandomSayBehaviour = require("../behaviour/randomSayBehaviour");
const fluffaction = require("../action/fluffaction");
const Furby = require("../furby/furby");


module.exports = class FurbyFactory {

	constructor() {
		this._furbies = {};
	}

	getFurbies(){
		return this._furbies;
	}

	createFurby(uuid, fluff) {

		const furby = new Furby(uuid, fluff);
		furby.learn(fluffaction.commands);
		furby.addBehaviour(new HackatonBehaviour());
		furby.addBehaviour(new RandomSayBehaviour());

		this._furbies[uuid] = furby;

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
