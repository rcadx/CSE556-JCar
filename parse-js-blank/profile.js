Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");


$("#settings").on("click", function() {
	window.location.replace("settings.html");
});

$("#backToHome").on("click", function() {
	window.location.replace(Parse.User.current().get("driver") ? "drivers.html" : "riders.html");
});


$(document).ready(function() {
	var user = Parse.User.current();
	var userFBID = user.get("fbID");

	var profPicURL = "https://graph.facebook.com/" + userFBID + "/picture?type=large";
	var profPicNode = "<img src=" + profPicURL + "><br>";

	var userName = user.get("firstName") + " " + user.get("lastName");
	var userNameNode = "<p id='name'><b>Name:</b> " + userName + "</p>";

	var driver = user.get("driver");
	var driverRatingNode = "";

	if (driver) {
		var driverRating = Number(user.get("rating"));
		var stars = "";
		for (var j = 0; j < driverRating; j++) {
			stars += "<img src='Star.png'>"
		}
		driverRatingNode = driverRating ? ("<p id=rating><b>Driver Rating:</b> " + stars + "</p>") : "<p>Driver Rating: This driver has no ratings yet.</p>"
	} else {
		$("#reviews").hide();
	}

	var div = "<div class='profileInfo'>" + profPicNode + userNameNode + driverRatingNode + "</div><br><br>";
		
	$("#profileDiv").append(div);
});