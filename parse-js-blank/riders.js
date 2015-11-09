Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

$("#newRideRequestBtn").on("click", function() {
	window.location.replace("newRideRequest.html");
});

$("#myRidesBtn").on("click", function() {
	window.location.replace("ridersMyRides.html");
});

$("#profileBtn").on("click", function() {
	window.location.replace("profile.html");
});

$("#date").datepicker();

$("#clearBtn").on("click", function() {
	location.reload(); //cheap way of doing this lol
});

//Filter method
$("#destination, #pickupLoc, #date, #startTime, #endTime, #price, #numSeats").on("change", function() {
	filterList();
});

$("input[type=radio][name=rating]").on("change", function() {
	filterList();
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
	
	var Rides = Parse.Object.extend("Rides");
	var query = new Parse.Query(Rides);
	query.ascending("date");
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

});

function clearRidesList() {
	$("#existingRides").empty();
}

function displayRides(ridesArr) {
	for (var i = 0; i < ridesArr.length; i++) {
		var ride = ridesArr[i];

		//Date and time
		var date = new Date(ride.get("date"));
		var time = date.toLocaleTimeString();
		var day = weekday[date.getDay()];
		var dateNode = "<p id=date>Date: " + day + ", " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " at " + time + "</p>";

		//Destination
		var destination = ride.get("destination");
		var destinationNode = "<p id=destination>Destination: " + destination + "</p>";

		//Price
		var price = ride.get("price");
		var priceNode = "<p id=price>Price: " + price + "</p>";

		//Available seats
		var seats = ride.get("numSeats");
		var seatsNode = "<p id=price>Seats Available: " + seats + "</p>";

		//Pickup Location
		var pickupLoc = ride.get("pickupLoc");
		var pickupNode = "<p id=price>Pickup Location: " + pickupLoc + "</p>";

		var driver = ride.get("createdBy");
		var driverRating = driver.get("rating");
		var driverRatingNode = driverRating ? ("<p id=rating>Driver Rating: " + driverRating + "</p") : "<p>Driver Rating: This driver has no ratings yet.</p>"

		//Outer Div
		var div = "<div class=ride>" + dateNode + destinationNode + priceNode + seatsNode + pickupNode + driverRatingNode + "</div><br>";
			
		$("#existingRides").append(div);
	}	
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
	var rating = $("#rating").val() ? Number($("#rating").val()) : "";
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

		var rideDate = new Date(ride.get("date"));	
		if (date && (date.getMonth() != rideDate.getMonth() || date.getDate() != rideDate.getDate() || date.getFullYear() != rideDate.getFullYear())) {	
			continue;
		}

		if (startTime && !(startTime.getTime() < rideDate.getTime())) {
			continue;
		}

		if (endTime && !(endTime.getTime() > rideDate.getTime())) {
			continue;
		}

		var ridePrice = ride.get("price");
		if (price && (price < ridePrice)) {
			continue;
		}

		var driver = ride.get("createdBy");
		var driverRating = driver.get("rating");
		if (rating && driverRating && (driverRating < rating)) {
			continue;
		}

		ridesToDisplay.push(ride);
	}

	clearRidesList();
	displayRides(ridesToDisplay);
}
