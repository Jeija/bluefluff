const winston = require("winston");
const ActionService = require("../action/ActionService");


const actionService = new ActionService();

module.exports = class RandomSayBehaviour {
	constructor() {
		this.quoteListener = (furby,state) => state && this.quote(furby);
	}

	startBehaviour(furby) {
		furby.addEventListener("ANTENNA_LEFT", this.quoteListener);
	}

	stopBehaviour(furby) {
		furby.removeEventListener("ANTENNA_LEFT", this.quoteListener);
	}

	quote(furby) {
		const ready = furby.isOff('ACTION_IN_PROGRESS');
		console.log('info', '### ready bit is ' + ready);

		if (! ready) {
			return;
		}
		const actionNames = actionService.getActionNames();
		const randomAction = actionNames[Math.floor(Math.random() * actionNames.length)];
		furby.do("action", { name: randomAction});
	}

};
