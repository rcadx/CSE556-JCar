Parse.initialize("eamcKJmUTepWXqQzYx5iNmgVUcX55xvCQX749IfY", "Gg3ZOGnMTkHaMIOZ0OJHsig6QwU5j8Jev2RkIZML");

$("#logoutBtn").on("click", function() {
	Parse.User.logOut();
	window.location.replace("login.html");
});