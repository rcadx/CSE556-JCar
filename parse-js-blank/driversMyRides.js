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

$(document).on("click", '.unBookRide', function() {
	var id = $(this).attr("id");
	unBookRide(id);
});

$(document).on("click", '.cancelRide', function() {
	var id = $(this).attr("id");
	cancelRide(id);
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
			displayRides();
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

	var Rides = Parse.Object.extend("RideRequests");
	var query2 = new Parse.Query(Rides);
	query2.equalTo("driver", Parse.User.current());
	query2.include("createdBy");
	query2.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var ride = rides[i];
				acceptedRidesArray.push(ride);
			}
			displayAcceptedRides();
		},
		error: function(error) {
			console.log("No rides found");
		}
	});

});

function displayRides() { //accepted parameter is flag for whether to append ride to acceptedRidesList or myRidesList in html
	for (var i = 0; i < ridesArray.length; i++) {
		//Date and time
		var ride = ridesArray[i];

		var date = new Date(ride.get("date"));
		var time = date.toLocaleTimeString();
		var day = weekday[date.getDay()];
		var dateNode = "<p id=date><b>Date:</b> " + day + ", " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " at " + time + "</p>";

		//Destination
		var destination = ride.get("destination");
		var destinationNode = "<p id=destination><b>Destination:</b> " + destination + "</p>";

		//Price
		var price = ride.get("price");
		var priceNode = "<p id=price><b>Price:</b> " + price + "</p>";

		//Available seats
		var seats = ride.get("numSeats");
		var seatsNode = "<p id=price><b>Seats Available:</b> " + seats + "</p>";

		//Pickup Location
		var pickupLoc = ride.get("pickupLoc");
		var pickupNode = "<p id=price><b>Pickup Location:</b> " + pickupLoc + "</p>";

		//Riders
		var riders = ride.get("riders");
		var riderNamesNode = "<p id='ridersNames'><b>Other Riders:</b>";
		for (var j = 0; j < riders.length; j++) {
			var rider = riders[j];
			riderNamesNode += " " + rider.get("firstName") + " " + rider.get("lastName");
			if (j < riders.length - 1) {
				riderNamesNode += ", ";
			} else {
				riderNamesNode += " ";
			}	
		}
		riderNamesNode += "</p>"

		//cancel button
		var button = "<button class='cancelRide' id='" + ride.id + "'>CANCEL RIDE</button>";

		//Outer Div
		var div = "<div class=ride>" + dateNode + destinationNode + priceNode + seatsNode + pickupNode + riderNamesNode + button + "</div><br><br>";
			
		$("#myRidesList").append(div);
	}		
}

function displayAcceptedRides() {
	for (var i = 0; i < acceptedRidesArray.length; i++) {
		var ride = acceptedRidesArray[i];

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
		var riderProfPicURL = "https://graph.facebook.com/" + riderFBID + "/picture?type=normal";
		var riderProfPicNode = "<img src=" + riderProfPicURL + "><br>";

		//Name of Driver
		var riderName = rider.get("firstName") + " " + rider.get("lastName");
		var riderNameNode = "<p id='name'><b>Rider's Name:</b> " + riderName + "</p>";

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

		//Outer Div
		var div = "<div class='ride' style='border-style: solid; border-color: " + "black" + "'>" + riderProfPicNode + riderNameNode + dateNode + destinationNode + priceNode + pickupNode + numSeatsNode + button + "</div><br><br>";
			
		$("#acceptedRidesList").append(div);
	}

}

function unBookRide(id) {
	var Rides = Parse.Object.extend("RideRequests");
	var ride = new Rides();
	ride.id = id;
	ride.unset("driver");
	ride.save();

	alert("You have successfully updated that you can no longer drive this ride!");
	
	location.reload();
}

function cancelRide(id) {
	var Rides = Parse.Object.extend("Rides");
	var query = new Parse.Query(Rides);
	query.get(id, {
  		success: function(myObj) {
	    // The object was retrieved successfully.
	    myObj.destroy({
	    	success: function(myObj) {
	    		alert("You have successfully canceled this ride!");
	    		location.reload();
	    	},
	    	error: function(myObj) {

	    	}
	    });
	  },
	  error: function(object, error) {
	    // The object was not retrieved successfully.
	    // error is a Parse.Error with an error code and description.
	  }
	});
}
