﻿$(function(){

	var app_id = '1861137890811189';
	var scopes = 'email, user_friends, public_profile';

	var btn_login = '<a href="#" id = "login" class="btn btn-primary">Iniciar Sesión</a>';

	var div_session = "<div id = 'facebook-session'>"+
					  "<strong></strong>"+
					  "<img>"+
					  "<a href='#' id='logout' class ='btn btn-danger'><span class='glyphicon glyphicon-log-out'></span></a>"+
					  "</div>";

	window.fbAsyncInit = function() {
	  	FB.init({
		    appId      : app_id,
		    status 	   :true,
		    cookie     : true,  // enable cookies to allow the server to access 
		    xfbml      : true,  // parse social plugins on this page
		    version    : 'v2.8' // use graph api version 2.8
  		});

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response, function(res){
		});
  	});
};


  var statusChangeCallback = function(response, callback) {
    console.log('statusChangeCallback');
    console.log(response);
	//$("#hello")[0].innerHTML=response.status;
    if (response.status === 'connected') {
		getFacebookData();
		toMap();
    } else {
    	callback(false);
   
    }
  }

  var checkLoginState = function(callback) {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response,res=>callback(res));
    });
  }

var getFacebookData  = function (){

	FB.api('/me', function(response){
		//$("#hello")[0].innerHTML=response.status;
		localStorage.setItem(USER_NAME,response.name);
		localStorage.setItem(USER_ID,response.id);
		$('#login').after(div_session);
		$('#login').remove();
		toMap();
	})
}

const toMap=()=>{
	$("#wrapper")[0].className="";
	$("#FBlogin")[0].className="noVisible";
	init();
}


var facebookLogin = function(){
	checkLoginState(function(response) {
		if(!response){
			console.log(response);
			FB.login(function(response) {
				if (response.status === 'connected') 
					getFacebookData();
			}, {scope: scopes});
		}
	})
}


var facebookLogout = function() {
	FB.getLoginStatus(function(res) {
		if(res.status === 'connected'){
			FB.logout(function(res){
				$('#facebook-session').before(btn_login);
				$('#facebook-session').remove();
				location.reload();
			})
		}
	});
}


	  $(document).on('click', '#login', function(e){
	  	e.preventDefault();

	  	facebookLogin();
	  })

	    $(document).on('click', '#logout', function(e){
			e.preventDefault();
	  	if(confirm("¿Estas seguro?")){
			localStorage.setItem(USER_NAME,null);
			localStorage.setItem(USER_ID);
			facebookLogout();
		}
	  	else
	  		return false;
	  })

})		

