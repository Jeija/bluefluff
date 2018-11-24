
module.exports = class TailActivationBehaviour {
	constructor() {
		this.tail =  (furby, state) => this.tailToggle(furby, state);
		this._lightOn = false;
		this._timer = undefined;
	}

	startBehaviour(furby) {
		furby.addEventListener("TAIL", this.tail);
	}

	stopBehaviour(furby) {
		furby.removeEventListener("TAIL", this.tail);
	}


	tailToggle(furby, tailPulled) {

		if (tailPulled) {
			this._timer = setTimeout(() => {
				this._timer = undefined;
				this._lightOn = !this._lightOn;
				furby.do("antenna", { green: this._lightOn? 255:0, red: 0, blue: 0 })
			}, 1000);
		} else if (this._timer) {
			clearTimeout(this._timer);
		}
	}

};
