Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");
$("#yesCar").change(function(event){
  $('#yesCarExpand').slideToggle('slow');

});
$("#noCar").change(function(event){
  $('#yesCarExpand').slideToggle('slow');
});

$("#signUpBtn").click(function(event) {
  var firstName = document.getElementById("firstName").value;
  var lastName  = document.getElementById("lastName").value;
  var username  = document.getElementById("username").value;
  var email     = document.getElementById("email").value;
  var phone     = document.getElementById("phone").value;
  var password  = document.getElementById("password").value;
  var confirm   = document.getElementById("confirmPassword").value;
  var isDriver = document.getElementById("yesCar").checked;
  var payment = document.querySelector('input[name="payment"]:checked').value;
  var existingRides = [];
  var carModel = document.getElementById("carModel").value;
  var carColor = document.getElementById("carColor").value;
  var numSeats = parseInt($("#numSeats"));

  if (!firstName || !lastName || !email || !password) {
    alert("Fill out all fields!");
    return;
  }
    if (password.length < 6 || confirm.length < 6) {
    alert("Password not long enough!");
    return;
  }

  if (!password.match(confirm)) {
    alert("Passwords don't match!");
    return;
  }



  var re = /.*@wustl\.edu$/;
  if (!email.match(re)) {
    alert("You must use your wustl email");
    return;
  }

  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
  user.set("driver", isDriver);
  user.set("firstName", firstName);
  user.set("lastName", lastName);
  user.set("phone", phone);
  user.set("payment", payment);
  
  user.set("carColor", carColor);
  user.set("carType", carModel);
  user.set("numSeats", numSeats);
  user.set("existingRides", []);
  user.signUp(null, {
  success: function(user) {
    if (payment == "Card") {
       window.location.replace("card.html");
    } else if (payment == "Paypal") {
       window.location.replace("paypal.html");
    } else {
       window.location.replace("cash.html");
    }
   
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
  });
});



