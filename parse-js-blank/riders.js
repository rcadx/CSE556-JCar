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

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var ridesArr = new Array();

$(document).ready(function() {
	
	var Rides = Parse.Object.extend("Rides");
	var query = new Parse.Query(Rides);
	query.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				ridesArr.push(ride);
			}
			displayRides();
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

});

function displayRides() {
	for (var i = 0; i < ridesArr.length; i++) {
		//Date and time
		var ride = ridesArr[i];

		var date = new Date(ride.get("date"));
		var localDate = date.toLocaleTimeString();
		var day = weekday[date.getDay()];
		var dateNode = "<p id=date>Date: " + day + ", " + localDate + "</p>";

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
			
		$("#existingRides").append(div);
	}
		
}