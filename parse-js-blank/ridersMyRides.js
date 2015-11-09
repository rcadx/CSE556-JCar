Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var ridesArr = new Array();

$("#backToHome").on("click", function() {
	window.location.replace("drivers.html");
});

$(document).ready(function() {
	var Rides = Parse.Object.extend("RideRequests");
	var query = new Parse.Query(Rides);
	query.equalTo("createdBy", Parse.User.current());
	query.ascending("date");
	query.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				ridesArr.push(ride);

				displayRides();
			}
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
		var start = new Date(ride.get("startTime"));
		var end = new Date(ride.get("endTime"));
		var startTime = start.toLocaleTimeString();
		var endTime = end.toLocaleTimeString();
		var day = weekday[date.getDay()];
		var dateNode = "<p id=date>Date: " + day + ", " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " from " + startTime + " to " + endTime + "</p>";

		//Destination
		var destination = ride.get("destination");
		var destinationNode = "<p id=destination>Destination: " + destination + "</p>";

		//Price
		var price = ride.get("price");
		var priceNode = "<p id=price>Price: " + price + "</p>";

		//Pickup Location
		var pickupLoc = ride.get("pickupLoc");
		var pickupNode = "<p id=price>Pickup Location: " + pickupLoc + "</p>";

		//Outer Div
		var div = "<div class=ride>" + dateNode + destinationNode + priceNode + pickupNode + "</div><br><br>";
			
		$("#myRidesList").append(div);
	}
		
}