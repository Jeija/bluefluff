const winston = require("winston");
winston.level = process.env.LOG_LEVEL || "debug";
const fluffaction = require("../action/fluffaction");
const actions = require("./actions.json");


module.exports = class ActionService {

	constructor() {
		this._commands = fluffaction.commands;
		this._actions = this.transform(actions);
	}

	getCommands(){
		return this._commands;
	}

	getActionNames() {
		return Object.keys(this._actions);
	}

	transform(actions) {
		let transformedActions = {};
		for (let i in actions) {
			const a = actions[i];
			const transformed = {
				readable: a.name,
				cmd: 'action',
				params: { input: a.input, index: a.index, subindex: a.subindex, specific: a.specific }
			};
			transformedActions[a.name] = transformed;
		}
		return transformedActions;
	}
};
