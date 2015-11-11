Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

$("#createRideBtn").on("click", function() {
	window.location.replace("createRide.html");
});

$("#myRidesBtn").on("click", function() {
	window.location.replace("driversMyRides.html");
});

$("#profileBtn").on("click", function() {
	window.location.replace("profile.html");
});

$("#date").datepicker();


$("#clearBtn").on("click", function() {
	location.reload(); //cheap way of doing this lol
});

$("#destination, #pickupLoc, #date, #startTime, #endTime, #price, #numSeats").on("change", function() {
	filterList();
});

$("input[type=radio][name=rating]").on("change", function() {
	filterList();
});

$("#settings").on("click", function() {
	window.location.replace("settings.html");
});

$(document).on("click", '.bookRide', function() {
	var id = $(this).attr("id");
	bookRide(id);
});

$(document).on("click", '.unBookRide', function() {
	var id = $(this).attr("id");
	unBookRide(id);
});

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var ridesArray = new Array();

$(document).ready(function() {
	var Rides = Parse.Object.extend("RideRequests");
	var query = new Parse.Query(Rides);
	query.ascending("date");
	query.include("createdBy");
	query.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				ridesArray.push(ride);
			}
			displayRides(ridesArray);
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

	var TempRides = Parse.Object.extend("TempRides");
	var query2 = new Parse.Query(TempRides);
	query2.include("rider");
	query2.include("ride");
	query2.equalTo("driver", Parse.User.current());
	query2.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var tempRide = rides[i];
				var ride = tempRide.get("ride");
				var rider = tempRide.get("rider");
				var alertString = "Rider " + rider.get("firstName") + " " + rider.get("lastName") + " has joined your ride to " + ride.get("destination") + ". Go to your \"My Rides\" page to see this update.";
				alert(alertString);
				//Destroy in database so this popup doesn't occur in future loads of this screen
				tempRide.destroy({});
			}
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

});

function displayRides(ridesArr) {
	for (var i = 0; i < ridesArr.length; i++) {
		var ride = ridesArr[i];

		//Date and time
		var start = new Date(ride.get("startTime"));
		var end = new Date(ride.get("endTime"));
		var startTime = start.toLocaleTimeString();
		var endTime = end.toLocaleTimeString();
		var date = new Date(ride.get("date"));
		var day = weekday[date.getDay()];
		var dateNode = "<p id=date><b>Date:</b> " + day + ", " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " from " + startTime + " to " + endTime + "</p>";

		//Destination
		var destination = ride.get("destination");
		var destinationNode = "<p id='destination'><b>Destination:</b> " + destination + "</p>";

		//Price
		var price = ride.get("price");
		var priceNode = "<p id=price><b>Requested Price:</b> " + price + "</p>";

		//Pickup Location
		var pickupLoc = ride.get("pickupLoc");
		var pickupNode = "<p id='pickupLoc'><b>Requested Pickup Location:</b> " + pickupLoc + "</p>";

		//Seats Needed
		var numSeats = ride.get("numSeats");
		var numSeatsNode = "<p id='numSeats'><b>Number Seats Requested:</b> " + numSeats + "</p>";

		//Facebook Picture of Driver
		var rider = ride.get("createdBy");
		var riderFBID = rider.get("fbID");
		var riderProfPicURL = "https://graph.facebook.com/" + riderFBID + "/picture?type=large";
		var riderProfPicNode = "<img src='" + riderProfPicURL + "' width='300' height='250'><br>";

		//Name of Driver
		var riderName = rider.get("firstName") + " " + rider.get("lastName");
		var riderNameNode = "<p id='name'><b>Rider's Name:</b> " + riderName + "</p>"

		//See if the ride has been booked already by you
		var driver = ride.get("driver");
		var user = Parse.User.current();
		var booked = (driver && driver.id == user.id);

		//I can Drive button
		var button = "";
		if (!booked) {
			button = "<button class='bookRide' id='" + ride.id + "'>I CAN DRIVE</button>"
		} else {
			button = "<button class='unBookRide' id='" + ride.id + "'>I CAN NO LONGER DRIVE</button>";
		}

		//Left div
		var divLeft = "<div class='rideLeft' style='text-align: center; width: 33%; height: 100%; float: left'>" + riderProfPicNode + riderNameNode + "</div>";

		//Right Div
		var divRight = "<div class='rideCenter' style='width: 66%; height: 100%; float: right'>" + dateNode + destinationNode + priceNode + pickupNode + numSeatsNode + button + "</div>";
		

		//Outer Div
		// var div = "<div class='ride' style='border-style: solid; border-color: " + (booked ? "green" : "black") + "'>" + riderProfPicNode + riderNameNode + dateNode + destinationNode + priceNode + pickupNode + numSeatsNode + button + "</div><br><br>";
			

		//Outer Div
		var div = "<div class='ride' id='" + ride.id + "' style='padding: 10px; height: 280px; border-style: solid; background-color:" + (booked ? "#CCFFCC;" : "#FFFFCC;") + "border-color: " + (booked ? "green" : "red") + "'>" + divLeft + divRight + "</div><br><br>";
	
		$("#rideRequests").append(div);
	}		
}

function clearRidesList() {
	$("#rideRequests").empty();
}

function filterList() {
	var destination = $("#destination").val();
	var pickupLoc = $("#pickupLoc").val();
	var d = $("#date").val();
	var date = d ? new Date(d) : "";
	var start = $("#startTime").val();
	var end = $("#endTime").val();

	var startTime = (start && date) ? new Date(d + " " + start) : "";
	var endTime = (end && date) ? new Date(d + " " + end) : "";

	var price = $("#price").val() ? Number($("#price").val()) : "";
	var numSeats = $("#numSeats").val() ? Number($("#numSeats").val()) : "";

	var ridesToDisplay = new Array(); 

	//Go through all the rides and push all the rides to the ridesToDisplay array that then displayArray will be called on, which will display all the rides
	for (var i = 0; i < ridesArray.length; i++) {
		var ride = ridesArray[i];

		var rideDestination = ride.get("destination");
		if (destination != "" && destination != rideDestination) {
			continue;
		}

		var ridePickupLoc = ride.get("pickupLoc");
		if (pickupLoc != "noPreference" && pickupLoc != ridePickupLoc) {
			continue;
		}

		var rideStartTime = new Date(ride.get("startTime"));
		var rideEndTime = new Date(ride.get("endTime"));

		if (date && (date.getMonth() != rideStartTime.getMonth() || date.getDate() != rideStartTime.getDate() || date.getFullYear() != rideStartTime.getFullYear())) {	
			continue;
		}

		if (startTime && !(startTime.getTime() < rideStartTime.getTime())) {
			continue;
		}

		if (endTime && !(endTime.getTime() > rideEndTime.getTime())) {
			continue;
		}

		var ridePrice = ride.get("price");
		if (price && (price > ridePrice)) {
			continue;
		}

		ridesToDisplay.push(ride);
	}

	clearRidesList();
	displayRides(ridesToDisplay);
}

function bookRide(id) {
	var Rides = Parse.Object.extend("RideRequests");
	var ride = new Rides();
	ride.id = id;
	ride.set("driver", Parse.User.current());
	ride.save();

	var TempRideRequests = Parse.Object.extend("TempRideRequests");
	var tempRideRequest = new TempRideRequests();
	var rider = ride.get("createdBy");
	tempRideRequest.set("ride", ride);
	tempRideRequest.set("driver", Parse.User.current());
	tempRideRequest.set("rider", rider);
	tempRideRequest.save();

	alert("You have successfully said you can drive this ride request!");

	clearRidesList();
	displayRides(ridesArray);
}

function unBookRide(id) {
	var Rides = Parse.Object.extend("RideRequests");
	var ride = new Rides();
	ride.id = id;
	ride.unset("driver");
	ride.save();

	alert("You have successfully updated that you can no longer drive this ride!");
	
	clearRidesList();
	displayRides(ridesArray);
}

