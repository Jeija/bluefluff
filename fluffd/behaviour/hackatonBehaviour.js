
module.exports = class TestBehaviour {
	constructor() {

		this.tail =  (furby, state) => this.schwanzToggle(furby, state);
		this.tounge =  (furby, state) => this.zungeToggle(furby, state);
		this.antenna1 = (furby, state) => state && this.say(furby, "wet fart- sniff earthy- with a hint of banana cake");
		this.antenna2 = (furby,state) => state && this.say(furby,"nice");
	}

	startBehaviour(furby) {
		furby.addEventListener("TAIL", this.tail);
		furby.addEventListener("TONGUE", this.tounge);
		furby.addEventListener("ANTENNA_FRONT", this.antenna1);
		furby.addEventListener("ANTENNA_BACK", this.antenna2);
	}

	stopBehaviour(furby) {
		furby.removeEventListener("TAIL", this.tail);
		furby.removeEventListener("TONGUE", this.tounge);
		furby.removeEventListener("ANTENNA_FRONT", this.antenna1);
		furby.removeEventListener("ANTENNA_BACK", this.antenna2);
	}

	say(furby, what) {
		furby.do("action", { name: what});
	}

	schwanzToggle(furby, state) {
		furby.do("antenna", { green: state? 255:0, red: 0, blue: 0 })
	}

	zungeToggle(furby,state) {
		furby.do("antenna", { red: state? 255:0, green: 0, blue: 0 })
	}
};
