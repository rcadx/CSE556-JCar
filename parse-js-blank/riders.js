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

$("#settings").on("click", function() {
	window.location.replace("settings.html");
});

//Filter method
$("#destination, #pickupLoc, #date, #startTime, #endTime, #price, #numSeats").on("change", function() {
	filterList();
});

$("input[type=radio][name=rating]").on("change", function() {
	filterList();
});

$(document).on("click", '.bookRide', function() {
	var id = $(this).attr("id");
	bookRide(id);
});

$(document).on("click", '.unBookRide', function() {
	var id = $(this).attr("id");
	unBookRide(id);
});

$(document).on("click", '.displayReviews', function() {
	var num = $(this).attr("id");
	var reviewsID = "#reviews" + num;
	$(reviewsID).slideToggle("slow");
});

$(document).on("click", '.map', function() {
	window.location.replace("map.html");
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
	query.include("createdBy");
	query.include("objectId");
	query.include("riders");
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

	var TempRides = Parse.Object.extend("TempRideRequests");
	var query2 = new Parse.Query(TempRides);
	query2.include("driver");
	query2.include("ride");
	query2.equalTo("rider", Parse.User.current());
	query2.find({
		success: function(rides) {
			for (var i = 0; i < rides.length; i++) {
				var tempRide = rides[i];
				var ride = tempRide.get("ride");
				var driver = tempRide.get("driver");
				var alertString = "Driver " + driver.get("firstName") + " " + driver.get("lastName") + " has agreed to drive you to " + ride.get("destination") + ". Go to your \"My Rides\" page to see this update.";
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
		var dateNode = "<p id=date><b>Date:</b> " + day + ", " + (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + (date.getFullYear()) + " at " + time + "</p>";

		//Destination
		var destination = ride.get("destination");
		var destinationNode = "<h2 id='destination' style='width:200px; margin-left:auto; margin-right:auto'><b>" + destination + "</b></h2>";

		//Price
		var price = ride.get("price");
		var priceNode = "<p id='price'><b>Price:</b> " + price + "</p>";

		//Available seats
		var seats = Number(ride.get("numSeats"));
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
		var driverRatingNode = driverRating ? ("<p id=rating><b>Driver Rating:</b> " + stars + "</p>") : "<p><b>Driver Rating:</b> This driver has no ratings yet.</p>"

		//Facebook Picture of Driver
		var driverFBID = driver.get("fbID");
		var driverProfPicURL = "https://graph.facebook.com/" + driverFBID + "/picture?type=large";
		var driverProfPicNode = "<img src=" + driverProfPicURL + "><br>";

		//Name of Driver
		var driverName = driver.get("firstName") + " " + driver.get("lastName");
		var driverNameNode = "<p id='name'><b>Driver's Name:</b> " + driverName + "</p>"

		//See if the ride has been booked already by you
		var riders = ride.get("riders");
		var riderNamesNode = "<p id='ridersNames'><b>Other Riders:</b>";

		var booked = false;
		for (var j = 0; j < riders.length; j++) {
			var user = Parse.User.current();
			var rider = riders[j];
			if (rider.id == user.id) {
				booked = true;
			} else {
				riderNamesNode += " " + rider.get("firstName") + " " + rider.get("lastName");
			if (j < riders.length - 1) {
				riderNamesNode += ", ";
			} else {
				riderNamesNode += " ";
			}	
		}
			
		}
		riderNamesNode += "</p>"

		var driverId = driver.get("objectId");
		var driverProfileBtn = "<form action='otherProfile.html'><input type='submit' value='Go To Profile'><input type='text' name='id' value='" + driverId + "' hidden></form>";

		var button = "";
		if (booked) {
			button = "<button class='unBookRide' id='" + ride.id + "'>UNBOOK RIDE</button><br><button class='map'>GO TO MAP</button>"
		} else {
			button = "<button class='bookRide' id='" + ride.id + "'>BOOK RIDE</button><br><button class='map'>GO TO MAP</button>";
		}

		if (seats <= 0) {
			button = "<label><b>NO MORE AVAILABLE SEATS</b></label>"
		}
	

		var reviewsDiv = "<div><button class='displayReviews' id=" + i + ">Display Reviews</button><div id='reviews" + i + "' hidden><ul style='text-align: left; list-style-type: none; margin: 0; padding: 0;'><li>Awesome</li><li>Best</li></div></div>";

		//Left div
		var divLeft = "<div class='rideLeft' style='text-align: center; width: 33%; height: 100%; float: left'>" + driverProfPicNode + driverNameNode + driverRatingNode + reviewsDiv + "</div>";

		//Right Div
		var divRight = "<div class='rideCenter' style='width: 66%; height: 100%; float: right'>" + destinationNode + dateNode + priceNode + seatsNode + pickupNode + riderNamesNode + button + "</div>";
		
		//Outer Div
		// var div = "<div class='ride' id='" + ride.id + "' style='border-style: solid; border-color: " + (booked ? "green" : "black") + "'>" + driverProfPicNode + driverName + driverProfileBtn + driverRatingNode + dateNode + destinationNode + priceNode + seatsNode + pickupNode + riderNamesNode + button + "</div><br><br>";
			
		//Outer Div
		var div = "<div class='ride' id='" + ride.id + "' style='overflow:hidden; border-style: solid; background-color: " + (booked ? "#CCFFCC;" : "#FFFFCC;") + "border-color: " + (booked ? "green" : "red") + "'>" + divLeft + divRight + "</div><br><br>";

		$("#existingRides").append(div);

		$("#reviews").hide();
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
	var rating = $("input:radio[name='rating']:checked").val() ? Number($("input:radio[name='rating']:checked").val()) : "";
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

		var rideNumSeats = ride.get("numSeats");
		if (numSeats && (rideNumSeats < numSeats)) {
			continue;
		}

		ridesToDisplay.push(ride);
	}

	clearRidesList();
	displayRides(ridesToDisplay);
}

function bookRide(id) {
	var Rides = Parse.Object.extend("Rides");
	var ride = new Rides();
	ride.id = id;
	ride.add("riders", Parse.User.current());
	if (ride.get("numSeats") <= 0) {
		alert("You can't book this ride, there are no more available seats");
		return;
	}
	ride.increment("numSeats", -1);
	ride.save();

	var TempRides = Parse.Object.extend("TempRides");
	var tempRide = new TempRides();
	var driver = ride.get("createdBy");
	tempRide.set("ride", ride);
	tempRide.set("driver", driver);
	tempRide.set("rider", Parse.User.current());
	tempRide.save();

	alert("You have booked this ride!");

	clearRidesList();
	displayRides(ridesArray);
}

function unBookRide(id) {
	var Rides = Parse.Object.extend("Rides");
	var ride = new Rides();
	ride.id = id;
	ride.remove("riders", Parse.User.current());
	ride.increment("numSeats", 1);
	ride.save();

	alert("You have unbooked this ride!");
	
	clearRidesList();
	displayRides(ridesArray);
}

