/*
 * fluffd: Furby Bluetooth Low Energy / Bluetooth Smart Communication Server:
 * Connect to Furby, start fluff server:
 * node fluffd.js
 *
 * Connect to Furby, show all BLE services and characteristics and exit:
 * node main.js introspect
 *
 * fluffd acts as an HTTP server. It processes your action requests and reports
 * events such as sensor input (wiggling antenna, petting, feeding, ...) that
 * occurs to the Furby Connect.
 *
 * HTTP Request Format for Commands:
 * Commands are POST requests in the form http://[HOST]:3872/cmd/[NAME]
 * This will execute the command name "NAME".
 * The POST data has to be a JSON-encoded string containing:
 *	- params: parameters passed on to the command (optional)
 *	- target: UUID of Furby to execute the command on. If not provided, command will be executed on all connected furbies.
 */

// System: HTTP server and Bluetooth Low Energy Library
const winston = require("./logger");
const noble = require("noble");
const http = require("http");

// Project
const fluffaction = require("./fluffaction");
const fluffcon = require("./fluffcon");

// List of connected Furby Connects
let furbies = {};

/*** HTTP Server ***/
function startCommand(name, post_data, res) {
	// Respond with success / failure
	function respond(error) {
		if (error === false)
			res.end("ok");
		else
			res.end("error: " + error);
	}

	// Send command to all connected furbies
	if (!("target" in post_data) || post_data.target === "") {
		// Multiple furbies: Collect results from all furbies and respond
		let multiple_count = 0;
		let multiple_errstring = "";

		function respond_single(error) {
			if (error != false)
				multiple_errstring += error + "; ";

			multiple_count++;
			if (multiple_count >= Object.keys(furbies).length)
				respond(multiple_errstring === "" ? false : multiple_errstring);
		}

		winston.verbose("Sending " + name + " command to all Furbies, params:", post_data.params);
		for (let uuid in furbies)
			fluffaction.execute(furbies[uuid], name, post_data.params, respond_single);

		// Send command to a single one of the connected furbies
	} else {
		winston.verbose("Sending " + name + " command to single Furby " + post_data.target + ", params: " + post_data.params);

		if (post_data.target in furbies) {
			fluffaction.execute(furbies[post_data.target], name, post_data.params, respond);
		} else {
			winston.warn("could not find target");
			res.end("error: could not find target");
		}
	}
}

function parseCommand(name, req, res) {
	let POST = "";

	req.on("data", function (data) {
		POST += data;
	});
	req.on("end", function () {
		let post_data;
		try {
			post_data = JSON.parse(POST);
			startCommand(name, post_data, res);
		} catch(e) {
			winston.warn("Could not parse HTTP command: " + e);
			res.end("error: " + e);
			return;
		}
	});
}

http.createServer(function (req, res) {
	let fragments = req.url.substring(1).split("/");
	let query = fragments.splice(0, 2);
	query.push(fragments.join("/"));

	if (query[0] === "cmd") {
		res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});

		// Answer CORS preflights / unknown requests
		if (req.method === "POST")
			parseCommand(query[1], req, res);
		else
			res.end();
	} else if (query[0] === "list") {
		res.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
		res.end(JSON.stringify(fluffaction.list()));
	} else if (query[0] === "scan") {
		noble.startScanning(); // TODO: this is for testing
		res.end("scanning");
	} else {
		// empty answer, but with Access-Control-Allow-Origin: *
		res.writeHead(200, {
			"Content-Type": "text/plain",
			"Access-Control-Allow-Origin": "*"
		});
		res.end();
	}
}).listen(3872);

/*** noBLE Callbacks ***/
noble.on("stateChange", function (state) {
	if (state === "poweredOn") {
		noble.startScanning();
	} else {
		noble.stopScanning();
	}
});

noble.on("discover", function(peripheral) {
	if(peripheral.advertisement.localName === "Furby") {
		winston.info("Discovered Furby: " + peripheral.uuid);

		// Introspection mode
		if (process.argv[2] === "introspect") {
			fluffcon.introspect(peripheral);
			return;
		}

		// Normal server mode
		fluffcon.connect(peripheral, function (fluff) {
			furbies[peripheral.uuid] = fluff;
		});
	}
});
