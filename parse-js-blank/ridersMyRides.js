Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var ridesArr = new Array(); //non booked rides in Ride Requests table
var bookedRidesArr = new Array(); //booked rides in Ride Requests table
var bookedDriverSubmittedRides = new Array(); //booked rides in Rides table (holds Driver's submitted rides)

$("#backToHome").on("click", function() {
	window.location.replace("riders.html");
});

$(document).on("click", '.unBookRide', function() {
	var id = $(this).attr("id");
	unBookRide(id);
});

$(document).ready(function() {
	//Get all ride requests the user made
	var Rides = Parse.Object.extend("RideRequests");
	var query = new Parse.Query(Rides);
	query.equalTo("createdBy", Parse.User.current());
	query.ascending("date");
	query.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				var driver = ride.get("driver");
				if (!driver) { 
					ridesArr.push(ride);
				} 
				else {
					bookedRidesArr.push(ride);
				}
			
			}
			displayRides();
			displayAcceptedRideRequestsList();
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

	//Get all the driver submitted rides that the user booked
	var Rides2 = Parse.Object.extend("Rides");
	var query2 = new Parse.Query(Rides2);
	query2.include("createdBy");
	query2.include("riders");
	query2.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				var riders = ride.get("riders");
				var booked = false;
				for (var j = 0; j < riders.length; j++) {
					var user = Parse.User.current();
					var rider = riders[j];
					if (rider.id == user.id) {
						booked = true;
					}
				}
				if (booked) {
					bookedDriverSubmittedRides.push(ride);
				}
			}
			displayBookedDriverSubmittedRides();
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
			
		$("#pendingRideRequestsList").append(div);
	}
		
}

function displayAcceptedRideRequestsList() {
for (var i = 0; i < bookedRidesArr.length; i++) {
		//Date and time
		var ride = bookedRidesArr[i];

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
		var priceNode = "<p id=price>Requested Price: " + price + "</p>";

		//Pickup Location
		var pickupLoc = ride.get("pickupLoc");
		var pickupNode = "<p id=price>Pickup Location: " + pickupLoc + "</p>";

		//Outer Div
		var div = "<div class=ride>" + dateNode + destinationNode + priceNode + pickupNode + "</div><br><br>";
			
		$("#acceptedRideRequestsList").append(div);
	}
}

function displayBookedDriverSubmittedRides() {
	for (var i = 0; i < bookedDriverSubmittedRides.length; i++) {
			var ride = bookedDriverSubmittedRides[i];

			//Date and time
			var date = new Date(ride.get("date"));
			var time = date.toLocaleTimeString();
			var day = weekday[date.getDay()];
			var dateNode = "<p id=date><b>Date:</b> " + day + ", " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " at " + time + "</p>";

			//Destination
			var destination = ride.get("destination");
			var destinationNode = "<p id='destination'><b>Destination:</b> " + destination + "</p>";

			//Price
			var price = ride.get("price");
			var priceNode = "<p id='price'><b>Price:</b> " + price + "</p>";

			//Available seats
			var seats = ride.get("numSeats");
			var seatsNode = "<p id='numSeats'><b>Seats Available:</b> " + seats + "</p>";

			//Pickup Location
			var pickupLoc = ride.get("pickupLoc");
			var pickupNode = "<p id='pickupLoc'><b>Pickup Location:</b> " + pickupLoc + "</p>";

			//Driver rating
			var driver = ride.get("createdBy");
			var driverRating = Number(driver.get("rating"));
			var stars = "";
			for (var j = 0; j < driverRating; j++) {
				stars += "<img src='Star.png'>"
			}
			var driverRatingNode = driverRating ? ("<p id=rating><b>Driver Rating:</b> " + stars + "</p>") : "<p>Driver Rating: This driver has no ratings yet.</p>"

			//Facebook Picture of Driver
			var driverFBID = driver.get("fbID");
			var driverProfPicURL = "'https://graph.facebook.com/" + driverFBID + "/picture?type=normal'";
			var driverProfPicNode = "<img src=" + driverProfPicURL + "><br>";

			//Name of Driver
			var driverName = driver.get("firstName") + " " + driver.get("lastName");
			var driverNameNode = "<p id='name'><b>Driver's Name:</b> " + driverName + "</p><br>"

			//See if the ride has been booked already by you
			var riders = ride.get("riders");
			var booked = false;
			for (var j = 0; j < riders.length; j++) {
				var user = Parse.User.current();
				var rider = riders[j];
				if (rider.id == user.id) {
					booked = true;
				}
			}

			var button = "";
			if (booked) {
				button = "<button class='unBookRide' id='" + ride.id + "'>UNBOOK RIDE</button>"
			} else {
				button = "<button class='bookRide' id='" + ride.id + "'>BOOK RIDE</button>";
			}
		
			//Outer Div
			var div = "<div class='ride' id='" + ride.id + "' style='border-style: solid; border-color: " + "black" + "'>" + driverProfPicNode + driverName + dateNode + destinationNode + priceNode + seatsNode + pickupNode + driverRatingNode + button + "</div><br><br>";
			
			$("#bookedRidesList").append(div);
		}	
}

function unBookRide(id) {
	var Rides = Parse.Object.extend("Rides");
	var ride = new Rides();
	ride.id = id;
	ride.remove("riders", Parse.User.current());
	ride.increment("numSeats", 1);
	ride.save();

	alert("You have unbooked this ride!");
	
	location.reload();
}