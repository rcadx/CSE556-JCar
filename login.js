Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

$(document).ready(function() {

  $('#errorMsg').hide();

});


$("#loginBtn").on("click", function(event) {
  var username     = document.getElementById("username").value;
  var password  = document.getElementById("password").value;

  Parse.User.logIn(username, password, {
  success: function(user) {
    // Do stuff after successful login.
    // FB.login(function(response) {

    // }, {
    //   scope: 'user_friends'
    // });
    var user = Parse.User.current();
    var isDriver = user.get("driver");
    if (isDriver) {
      console.log("log in successful");
          window.location.replace("drivers.html");
    } else {
      window.location.replace("riders.html");
    }

  },
  error: function(user, error) {
    // The login failed. Check error to see why.
     $('#errorMsg').slideToggle('slow');

  }
});
});

$("#signUpBtn").on("click", function(event) {
  window.location.replace("signup.html");
});

	

