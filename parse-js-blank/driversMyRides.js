Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var ridesArray = new Array();
var acceptedRidesArray = new Array();

$("#backToHome").on("click", function() {
	window.location.replace("drivers.html");
});

$(document).ready(function() {
	
	var Rides = Parse.Object.extend("Rides");
	var query = new Parse.Query(Rides);
	query.equalTo("createdBy", Parse.User.current());
	query.ascending("date");
	query.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				ridesArray.push(ride);
			}
			displayRides(ridesArray, false);
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

	var Rides = Parse.Object.extend("RideRequests");
	var query = new Parse.Query(Rides);
	query.equalTo("driver", Parse.User.current());
	query.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				acceptedRidesArray.push(ride);
			}
			displayRides(acceptedRidesArray, true);
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

});

function displayRides(ridesArr, accepted) { //accepted parameter is flag for whether to append ride to acceptedRidesList or myRidesList in html
	for (var i = 0; i < ridesArr.length; i++) {
		//Date and time
		var ride = ridesArr[i];

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

		//Outer Div
		var div = "<div class=ride>" + dateNode + destinationNode + priceNode + seatsNode + pickupNode + "</div><br><br>";
			
		if (accepted) {
			$("#acceptedRidesList").append(div);
		} else {
			$("#myRidesList").append(div);
		}
	}
		
}