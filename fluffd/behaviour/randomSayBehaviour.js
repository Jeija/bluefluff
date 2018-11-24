
module.exports = class RandomSayBehaviour {
	constructor() {
		this.quoteListener = (furby,state) => state && this.quote(furby);
	}

	startBehaviour(furby) {
		furby.addEventListener("ANTENNE_LINKS", this.quoteListener);
	}

	stopBehaviour(furby) {
		furby.removeEventListener("ANTENNE_LINKS", this.quoteListener);
	}

	quote(furby) {
		const what = "nice";
		furby.do("action", { name: what});
	}

};
