const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";
const HackatonBehaviour = require("../behaviour/hackatonBehaviour");
const RandomSayBehaviour = require("../behaviour/randomSayBehaviour");
const TailActivationBehaviour = require("../behaviour/tailActivationBehaviour");
const ActionService = require("../action/ActionService");

const Furby = require("../furby/Furby");

const actionService = new ActionService();

module.exports = class FurbyFactory {

	constructor() {
		this._furbies = {};
	}

	getFurbies(){
		return this._furbies;
	}

	createFurby(uuid, fluff) {

		const furby = new Furby(uuid, fluff);
		furby.learn(actionService.getCommands());
		furby.addBehaviour(new HackatonBehaviour());
		furby.addBehaviour(new RandomSayBehaviour());
		furby.addBehaviour(new TailActivationBehaviour());

		this._furbies[uuid] = furby;

	}
};
