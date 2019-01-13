const winston = require("./logger");

/*
 * Bluetooth LE GATT Services and Characteristics
 * We only care about the "FLUFF" service and its characteristics here.
 * I have no idea if the given UUIDs have any meaning or are just random.
 * They are hardcoded into all Furbies and into the Furby Connect World App.
 */
const FURBY = {
	SERVICE: {
		FLUFF: "dab91435b5a1e29cb041bcd562613bde"
	},
	CHARACTERISTIC: {
		GENERALPLUS_WRITE: "dab91383b5a1e29cb041bcd562613bde",
		GENERALPLUS_LISTEN: "dab91382b5a1e29cb041bcd562613bde",
		NORDIC_WRITE: "dab90757b5a1e29cb041bcd562613bde",
		NORDIC_LISTEN: "dab90756b5a1e29cb041bcd562613bde",
		RSSI_LISTEN: "dab90755b5a1e29cb041bcd562613bde",
		FILEWRITE: "dab90758b5a1e29cb041bcd562613bde"
	}
};

// Handle Ctrl+C or other SIGINT events and make sure we close our connection
// Otherwise, Furby will remain in a state where it doesn't accept any connection attempts.
function exitHandler(furby) {
	process.on("SIGINT", function () {
		winston.info("\nClosing connection...");
		furby.disconnect(function(error) {
			if (error)
				winston.error("Error while disconnecting: " + error);
			else
				winston.info("Disconnected, exiting.");

			// TODO: This does not work with multiple furbies connect
			process.exit();
		});
	});
}

// Get GATT characterstic matching serviceUUID and characteristicUUID from furby peripheral.
// callback is a function(characteristic), where characteristic is a noBLE characteristic.
function getFurbyCharacteristics(furby, serviceUUID, characteristicUUIDs, callback) {
	furby.discoverServices([serviceUUID], function (error, services) {
		if (error) {
			winston.error("Error in discoverServices: " + error);
			return;
		}

		services[0].discoverCharacteristics(characteristicUUIDs, function (error, characteristics) {
			if (error) {
				winston.error("Error in discoverCharacteristics: " + error);
				return;
			}

			// Regroup characterstics by their UUIDs
			let charByUUID = {};
			characteristics.forEach(function (c) {
				charByUUID[c.uuid] = c;
			});
			callback(charByUUID);
		});
	});
}

/*
 * Fluff Class
 * The Fluff Class defines a connection to a single Furby Connect device. Multiple connections
 * to different Furbies can coexist at the same time. This class contains all functions necessary
 * for interfacing with Furby connect. It does not handle connection status etc. though,
 * since that requires asynchrnous operation. The Fluff class tries to not expose unnecessary
 * asynchronous functionality such as error handling to the outside, since Furby's actions tend
 * to follow a sequential pattern.
 */
class Fluff {
	constructor(gpWrite, gpListen, nWrite, nListen, rssiListen, fileWrite) {
		this.gpWrite = gpWrite;
		this.gpListen = gpListen;
		this.nWrite = nWrite;
		this.nListen = nListen;
		this.rssiListen = rssiListen;
		this.fileWrite = fileWrite;

		// Initialize empty list of callbacks
		this.gpCallbacks = [];
		this.nCallbacks = [];

		this.startIdle();
		this.subscribeNotifications();
	}

	// Write one command to GeneralPlusWrite characteristic
	generalPlusWrite(data, callback) {
		this.gpWrite.write(data, true, function (error) {
			if (error) {
				winston.warn("Error in generalPlusWrite: " + error);
				if (callback) callback("generalPlusWrite: " + error);
			} else {
				winston.verbose("generalPlusWrite: " + data.toString("hex"));
				if (callback) callback(false);
			}
		});
	}

	// Write a sequence of commands to GeneralPlusWrite characteristic
	generalPlusWriteSequence(sequence, callback) {
		let i = 0;

		let nextSeq = (function () {
			if (i < sequence.length) {
				this.gpWrite.write(sequence[i], true, function (error) {
					if (error) {
						winston.warn("Error in generalPlusWriteSequence: " + error);
						if (callback) callback("generalPlusWriteSequence: " + error);
						return;
					}

					i++;
					nextSeq();
				});
			} else {
				if (callback) callback(false);
			}
		}).bind(this);

		nextSeq();
	}

	// Write data to NordicWrite characteristic
	nordicWrite(data, callback) {
		this.nWrite.write(data, true, function (error) {
			if (error) {
				winston.warn("Error in nordicWrite: " + error);
				if (callback) callback("nordicWrite: " + error);
			} else {
				winston.verbose("nordicWrite: " + data.toString("hex"));
				if (callback) callback(false);
			}
		});
	}

	// Write data to slot, maximum 20 bytes
	writeToSlot(data, callback) {
		this.fileWrite.write(data, true, function (error) {
			if (error) {
				winston.warn("Error in writeToSlot: " + error);
				if (callback) callback("writeToSlot: " + error);
			} else {
				winston.verbose("writeToSlot: " + data.toString("hex"));
				if (callback) callback(false);
			}
		});
	}

	// Subscribe to GeneralPlusListen, RSSIListen and NordicListen characteristics
	subscribeNotifications() {
		this.nListen.on("data", (data) => {
			winston.verbose("Nordic notification: " + data.toString("hex"));
			for (let c of this.nCallbacks)
				c(data);
		});

		this.gpListen.on("data", (data) => {
			winston.verbose("GP notification: " + data.toString("hex"));
			for (let c of this.gpCallbacks)
				c(data);
		});

		this.rssiListen.on("data", (data) => {
			winston.verbose("RSSI notification: " + data.toString("hex"));
		});

		this.nListen.subscribe((error) => {
			if (error)
				winston.error("Error while subscribing to NordicListen: " + error);
		});

		this.gpListen.subscribe((error) => {
			if (error)
				winston.error("Error while subscribing to GeneralPlusListen: " + error);
		});

		this.rssiListen.subscribe((error) => {
			if (error)
				winston.error("Error while subscribing to RSSIListen: " + error);
		});
	}

	startIdle() {
		// Furby will start talking and moving if not somehow employed with something else to do.
		// Therefore, we can just feed it some empty 0x00 commands so that it doesn't start talking.
		// The app does this with 20:06 packets that trigger SendImHereSignal answers in 3 second interval,
		// but we can just use whatever we want.
		this.idleInterval = setInterval(this.generalPlusWrite.bind(this, new Buffer([0x00])), 3000);
	}

	stopIdle() {
		clearInterval(this.idleInterval);
	}

	addGeneralPlusCallback(callback) {
		this.gpCallbacks.push(callback);
	}

	addNordicCallback(callback) {
		this.nCallbacks.push(callback);
	}

	// General-Purpose Key-Value storage for actions
	setParam(param, value) {
		this.params[param] = value;
	}

	getParam(param) {
		return this.params[param];
	}
}


/*
 * Functions to be exported TODO: disconnect
 */
module.exports = {};

module.exports.connect = function (furby, callback) {
	furby.connect(function (error) {
		if (error) {
			winston.error("Error while connecting: " + error);
			return;
		}

		exitHandler(furby);

		let characteristicUUIDs = Object.values(FURBY.CHARACTERISTIC);
		getFurbyCharacteristics(furby, FURBY.SERVICE.FLUFF, characteristicUUIDs, function (characteristics) {
			let gpWrite = characteristics[FURBY.CHARACTERISTIC.GENERALPLUS_WRITE];
			let gpListen = characteristics[FURBY.CHARACTERISTIC.GENERALPLUS_LISTEN];
			let nWrite = characteristics[FURBY.CHARACTERISTIC.NORDIC_WRITE];
			let nListen = characteristics[FURBY.CHARACTERISTIC.NORDIC_LISTEN];
			let rssiListen = characteristics[FURBY.CHARACTERISTIC.RSSI_LISTEN];
			let fileWrite = characteristics[FURBY.CHARACTERISTIC.FILEWRITE];
			winston.debug("Read all fluff characteristics");
			callback(new Fluff(gpWrite, gpListen, nWrite, nListen, rssiListen, fileWrite));
		});

		winston.info("Connected to Furby");
	});
};

module.exports.introspect = function (furby) {
	exitHandler(furby);

	furby.connect(function (error) {
		if (error) {
			winston.error("Error while connecting for introspection: " + error);
			return;
		}

		winston.info("GATT data structure of furby with UUID " + furby.uuid);
		furby.discoverServices(null, function (error, services) {
			winston.info("Furby exposes the following services: ");

			let count = 0;

			// Scan all characteristics
			services.forEach(function(ser, idx) {
				ser.discoverCharacteristics(null, function (error, characteristics) {
					winston.info(" " + idx + ") uuid: " + ser.uuid + ", with characteristics: ");
					for (let i in characteristics)
						winston.info("    > uuid: " + characteristics[i]);

					count++;
					if (count >= services.length) {
						furby.disconnect(function (error) {
							if (error)
								winston.error("Error while disconnecting: " + error);
							else
								winston.info("Disconnected, exiting")

							process.exit();
						});
					}
				});
			});
		});
	});
};
