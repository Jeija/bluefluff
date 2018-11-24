
module.exports = class TestBehaviour {
	constructor() {

		this.tail =  (furby, state) => this.schwanzToggle(furby, state);
		this.tounge =  (furby, state) => this.zungeToggle(furby, state);
		this.antenna1 = (furby, state) => state && this.say(furby, "wet fart- sniff earthy- with a hint of banana cake");
		this.antenna2 = (furby,state) => state && this.say(furby,"nice");
	}

	startBehaviour(furby) {
		furby.addEventListener("SCHWANZ", this.tail);
		furby.addEventListener("ZUNGE", this.tounge);
		furby.addEventListener("ANTENNE_VORNE", this.antenna1);
		furby.addEventListener("ANTENNE_HINTEN", this.antenna2);
	}

	stopBehaviour(furby) {
		furby.removeEventListener("SCHWANZ", this.tail);
		furby.removeEventListener("ZUNGE", this.tounge);
		furby.removeEventListener("ANTENNE_VORNE", this.antenna1);
		furby.removeEventListener("ANTENNE_HINTEN", this.antenna2);
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
