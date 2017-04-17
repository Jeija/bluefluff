const winston = require("winston");
const fs = require("fs");
let commands = {};

/*** GeneralPlus Actions ***/
commands["antenna"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x14, params.red, params.green, params.blue]), callback);
	},
	readable : "Antenna Color",
	description : "Set Antenna Color",
	params : {
		red : "Brightness of red antenna LED (0-255)",
		green : "Brightness of green antenna LED (0-255)",
		blue : "Brightness of blue antenna LED (0-255)",
	}
}

commands["debug"] = {
	run : function(fluff, callback, callback) {
		fluff.generalPlusWrite(new Buffer([0xdb]), callback);
	},
	readable : "Debug Screen",
	description : "Cycle through LCD eye debug menus"
}

commands["lcd"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0xcd, params.state]), callback);
	},
	readable : "LCD Light",
	description : "Set LCD Eyes Background Light",
	params : {
		state : "0 for off, 1 for on"
	}
}

commands["action"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x13, 0x00, params.input, params.index, params.subindex, params.specific]), callback);
	},
	readable : "Action",
	description : "Furby move / talk action",
	params : {
		input : "Where to find the action",
		index : "Index of actions",
		subindex : "Subindex of action",
		specific : "Specific action"
	}
}

commands["setname"] = {
	run : function(fluff, params, callback) {
		// 0x21: Actually set name, 0x13: action to say name afterwards
		fluff.generalPlusWriteSequence([
			new Buffer([0x21, params.name]),
			new Buffer([0x13, 0x00, 0x21, 0x00, 0x00, params.name])
		], callback);
	},
	readable : "Set Name",
	description : "Set new Name and announce it",
	params : {
		name : "New name, value from 0-128"
	}
}

commands["custom"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer(params.cmd, "hex"), callback);
	},
	readable : "Custom Command",
	description : "Send arbitrary command to GeneralPlus",
	params : {
		cmd : "Command in hexadecimal format"
	}
}

commands["setidle"] = {
	run : function(fluff, params, callback) {
		if (params.idle === "1")
			fluff.startIdle();
		if (params.idle === "0")
			fluff.stopIdle();
	},
	readable : "Set Idle",
	description : "Enable or disable keeping Furby quiet",
	params : {
		idle : "1 = keep quiet (idle), 0 = don't idle"
	}
}

commands["moodmeter"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x23, params.action, params.type, params.value]), callback);
	},
	readable : "Set Moodmeter",
	description : "Enable or disable keeping Furby quiet",
	params : {
		action : "1 = set value, 0 = increase value",
		type : "0 = Excited, 1 = Displeased, 2 = Tired, 3 = Fullness, 4 = Wellness",
		value : "New value (action 1) or delta (action 0)"
	}
}

/*** Nordic Actions ***/
commands["nordic_custom"] = {
	run : function(fluff, params, callback) {
		fluff.nordicWrite(new Buffer(params.cmd, "hex"), callback);
	},
	readable : "Custom Nordic",
	description : "Send arbitrary command to Nordic",
	params : {
		cmd : "Command in hexadecimal format"
	}
}

commands["nordic_packetack"] = {
	run : function(fluff, params, callback) {
		fluff.nordicWrite(new Buffer([0x09, params.state, 0x00]), callback);
	},
	readable : "Set Nordic Packet ACK",
	description : "Enable / disable nordic packet ACK messages for file writing",
	params : {
		state : "0 for off, 1 for on"
	}
}

/*** DLC-related Actions ***/
commands["dlc_delete"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x74, params.slot]), callback);
	},
	readable : "Delete DLC",
	description : "Delete DLC from slot with ID",
	params : {
		slot : "Slot to be deleted (number)"
	}
}

commands["flashdlc"] = {
	run : function(fluff, params, callback) {
		dlcsize = fs.statSync(params.dlcfile)["size"]

		// Not sure what buf_slot does?? Is it really the DLC slot??
		let buf_cmd = Buffer.from([0x50, 0x00]);
		let buf_size = Buffer.from([dlcsize >> 16 & 0xff, dlcsize >> 8 & 0xff, dlcsize & 0xff]);
		let buf_slot = Buffer.from([0x02]);
		let buf_filename = Buffer.from(params.filename);
		let buf_end = Buffer([0x00, 0x00]);
		let cmd_prepare = Buffer.concat([buf_cmd, buf_size, buf_slot, buf_filename, buf_end]);

		fluff.generalPlusWrite(cmd_prepare, callback);

		// Wait until GeneralPlus is ready to receive (sends 24:02 response)
		fluff.addGeneralPlusCallback(function(data) {
			if (!(data[0] == 0x24 && data[1] == 0x02))
				return;
			winston.log("info", "FlashDLC: Got Ready to Receive");

			fs.readFile(params.dlcfile, function(error, dlc) {
				if (error)
					throw error;

				// Write DLC piece by piece
				let offset = 0;
				let flashint = setInterval(function() {
					piece = dlc.slice(offset, offset + 20)
					fluff.writeToSlot(piece);

					// End of buffer: Stop writing
					if (piece.length < 20)
						clearInterval(flashint);

					offset += 20;
				}, 5);
			});
		});
	},
	readable : "Flash DLC file",
	description : "Flash DLC file to slot on Furby",
	params : {
		filename : "DLC filename, e.g. TU003410.DLC",
		dlcfile : "Path to DLC file on fluffd server"
	}
}

commands["dlc_load"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x60, params.slot]), callback);
	},
	readable : "Load DLC",
	description : "Load DLC for activation",
	params : {
		slot : "DLC slot to be loaded (number)"
	}
}

commands["dlc_activate"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x61]), callback);
	},
	readable : "Activate DLC",
	description : "Activate loaded DLC - use after 'Load DLC'"
}

commands["dlc_deactivate"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x62, params.slot]), callback);
	},
	readable : "Deactivate DLC",
	description : "Deactivate DLC slot without deleting it",
	params : {
		slot : "DLC slot to be deactivated (number)"
	}
}

// This is section is for preprogrammed buttons that you can add yourself.
commands["other"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x13, 0x00, params.input, params.index, params.subindex, params.specific]), callback);
	},
	readable : "Preprogrammed Actions",
	description : "Furby move / talk buttons",
        buttons : {
	    name : {"setname":{"name":3}},
	    giggle : {"action":{"input":55,"index":2,"subindex":14,"specific":0}},
	    gigglefart : {"action":{"input":45,"index":0,"subindex":2,"specific":5}},
	    puke : {"action":{"input":56,"index":3,"subindex":15,"specific":1}},
	    "gonna be good" : {"action":{"input":55,"index":0,"subindex":1,"specific":0}},
	    perfect : {"action":{"input":55,"index":1,"subindex":2,"specific":1}},
	    "the best" : {"action":{"input":55,"index":1,"subindex":4,"specific":0}},
	    "get started" : {"action":{"input":42,"index":0,"subindex":4, "specific":4}},
	    "get started" : {"action":{"input":42,"index":0,"subindex":4, "specific":2}},
	    "so much to do": {"action":{"input":42,"index":0,"subindex":0,"specific":0}},
	    "Gonna watch all the things":{"action":{"input":44,"index":0,"subindex":0,"specific":1}},
	    "this is happening!":{"action":{"input":44,"index":0,"subindex":0,"specific":4}},
	    "ermagerd":{"action":{"input":44,"index":0,"subindex":0,"specific": 7}},
	    "give little guy a hand":{"action":{"input":45,"index":0,"subindex":7,"specific":3}},
	    "Thank you":{"action":{"input":48,"index":0,"subindex":0,"specific":1}},
	    "Challenge accepted":{"action":{"input":54,"index":0,"subindex":0,"specific":1}},
	    "legendary!":{"action":{"input":39,"index":3,"subindex":8,"specific":1}},
	    beatbox:{"action":{"input":39,"index":1,"subindex":13,"specific":2}},
	    ermagerd:{"action":{"input":39,"index":2,"subindex":4,"specific":5}},
	    "We rule! They drool!":{"action":{"input":55,"index":1,"subindex":4,"specific":1}},
	    "bye-bye":{"action":{"input":43,"index":0,"subindex":10,"specific":3}},
	}
}

// This is section is for preprogrammed buttons that you can add yourself.
commands["other2"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x13, 0x00, params.input, params.index, params.subindex, params.specific]), callback);
	},
	readable : "Preprogrammed Antenna colors",
	description : "Furby antenna buttons",
        buttons : {
	    "antenna off" :  {"antenna":{"red":0, "blue":0, "green":0}},
	    "antenna red" :  {"antenna":{"red":255, "blue":0, "green":0}},
	    "antenna blue" : {"antenna":{"red":0, "blue":255, "green":0}},
	    "antenna green" : {"antenna":{"red":0, "blue":0, "green":255}},
	    "antenna white" : {"antenna":{"red":255, "blue":255, "green":255}},
	}
}

commands["other3"] = {
	run : function(fluff, params, callback) {
		fluff.generalPlusWrite(new Buffer([0x13, 0x00, params.input, params.index, params.subindex, params.specific]), callback);
	},
	readable : "Preprogrammed Actions",
	description : "Furby move / talk buttons",
        buttons : {
	    "Oooh, hello":{"action":{"input":40,"index":0,"subindex":0,"specific":3}},

	    "wrestle, wrestle":{"action":{"input":46,"index":0,"subindex":1,"specific":0}},
	    "must touch":{"action":{"input":46,"index":0,"subindex":1,"specific":1}},
	    "poke it":{"action":{"input":46,"index":0,"subindex":1,"specific":2}},
	    "Touch it":{"action":{"input":46,"index":0,"subindex":1,"specific":3}},
	    "pokey, pokey":{"action":{"input":46,"index":0,"subindex":1,"specific":4}},
	    "faster":{"action":{"input":55,"index":2,"subindex":23,"specific":0}},
	    "slower":{"action":{"input": 55,"index":2,"subindex":24,"specific":0}},
	}
}

module.exports = {
	execute : function(fluff, cmd, params, callback) {
		if (!commands[cmd])
			winston.log("error", "Command not found: " + cmd);
		else
			commands[cmd].run(fluff, params, callback);
	},

	list : function() {
		let list = {};

		// Remove functions from list
		for (let c in commands) {
			list[c] = {
				readable : commands[c].readable,
				description : commands[c].description,
				params : commands[c].params,
				buttons : commands[c].buttons
			};
		}

		return list;
	}
}
