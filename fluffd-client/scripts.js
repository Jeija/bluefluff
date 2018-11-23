var commands = {};

function fluffd_url(target) {
	var url = $("#fluffd_url").val();
	while (url.slice(-1) === "/")
		url = url.slice(0, url.length - 1);
	url += "/" + target;
	return url;
}

function sendcmd() {
	// Collect parameter data
	var params = {};
	$(".param").each(function () {
		var param = $(this).children(".paramname").children(".param_technical").text();
		params[param] = $(this).children(".param_value").val();
	});

	// For now: Always send all commands to all furbies connected to fluffd
	$.post(fluffd_url("cmd" + "/" + $("#commandname_technical").text()), JSON.stringify({
		params: params
	}), function (res) {
		if (res != "ok")
			alert(res);
	});
}

// Handle pressing enter after writing a parameter
function handle_enter_action() {
	$(".param_value").keydown(function (e) {
		if (e.keyCode == 13) {
			sendcmd();
		}
	});
}

// send a button command. First pull off the action, then the parameters.
function handle_button_click(cmd) {
	$("#buttons .button").click(function () {
		var button = commands[cmd].buttons[$(this).data("buttonid")];
		console.log(button);

		// For now: Always send all commands to all furbies connected to fluffd
		$.post(fluffd_url("cmd" + "/" + button.cmd), JSON.stringify({
			params: button.params
		}), function (res) {
			if (res != "ok")
				alert(res);
		});
	});
}

// New action in the left panel selected
function handle_select_action() {
	$(".action").click(function () {
		var cmd = $(this).data("cmd");

		// Make selection
		$(".action").each(function () {
			$(this).removeClass("selected");
		});
		$(this).addClass("selected");

		// Load command into main panel
		$("#commandname_readable").text(commands[cmd].readable);
		$("#commandname_technical").text(cmd);
		$("#command_desc").text(commands[cmd].description);

		// Load params into main panel
		$("#params").empty();
		$("#buttons").empty();

		for (var param in commands[cmd].params) {
			$("#params").append($("<div>").addClass("param")
				.append($("<div>").addClass("paramname")
					.append($("<span>").addClass("param_technical").text(param))
					.append($("<span>").addClass("param_delimiter").html(" &#8226; "))
					.append($("<span>").addClass("param_desc").text(commands[cmd].params[param])))
				.append($("<input type=\"text\">").addClass("param_value"))
			);
		}

		for (var id in commands[cmd].buttons)
			$("#buttons").append($("<input type=\"button\">")
				.addClass("button")
				.data("buttonid", id)
				.attr("value", commands[cmd].buttons[id].readable));


		handle_enter_action();
		handle_button_click(cmd);

		if (!("params" in commands[cmd] || "buttons" in commands[cmd])) {
			$("#noparams").show();
		} else {
			$("#noparams").hide();
		}
	});
}

function update_cmdlist() {
	$.get(fluffd_url("list"), function (data) {
		commands = JSON.parse(data);
		$("#actions").empty();
		for (var cmd in commands) {
			$("#actions").append($("<div>").addClass("action").data("cmd", cmd)
				.append($("<span>").addClass("actionname").text(commands[cmd].readable))
			);
		}
		handle_select_action();
		$("#actions").children().first().click();
	});
}

$(function () {
	update_cmdlist();
	$("#fluffd_refresh").click(update_cmdlist);
	$("#sendbutton").click(sendcmd);
});
