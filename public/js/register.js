$(function() {
	$('#college').prop('disabled',true);
});

$(document).ready(function(){ 

  $('#photography').click(function() {
   $('#photographySection').show();
   $('#contentWriterSection').hide();
 });

  $('#contentWriting').click(function(){
   $('#photographySection').hide();
   $('#contentWriterSection').show();
 });

});

function Validate() {
	var firstname = $("#fname").val();
	var lastname = $("#lname").val();
	var email = $("#email").val();
	var contact = $("#contact").val();
  var city = $("#tags").val();
	var link = ''; //$("#link").val();


  $('#addLinkTable tr').each(function(){
    link+= ","+$(this).find('input[type="text"]').val();
  });

  var num = Math.floor(Math.random() * 90000) + 10000;
  var pwd =num+'@123$';
  var er = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var data = {
    firstname:firstname,
    lastname:lastname,
    email:email,
    contact:contact,
    link:link,
    status:'approval_pending',
    role:'user',
    password:pwd,
    city:city 
  };

  if(firstname == "" || firstname == null) {
    $("#fname-err").html('<p class="error"> First Name can not be empty');
    $("#fname").focus();
    return false;
  }
  else {
    $("#fname-err").html("");
  }

  if(lastname == "" || lastname == null) {
    $("#lname-err").html('<p class="error">lastname can not be empty');
    $("#lname").focus();
    return false;
  }
  else {
    $("#lname-err").html("");
  }



  if(!er.test(email)) {
    $("#email-err").html('<p class="error">Enter a valid email');
    $("#email").focus();
    return false;
  }
  else {
    $("#email-err").html("");
  }

  if(contact=="" ||!(/^\d{10}$/.test(contact))) {
    $("#contact-err").html('<p class="error">Please enter a correct 10 digit Number');
    $("#contact").focus();
    return false;
  }
  else {
    $("#contact-err").html("");
  }


  if(city == "Select City") {
    $("#city-err").html('<p class="error">Please select a city');
    $("#city").focus();
    return false;
  }
  else {
    $("#city-err").html("");  
  }

  if( $('#link').val() =="") {
    $("#link-err").html('<p class="error">Please Enter past work link.');
    $("#link").focus();
    return false;
  }
  else {
    $("#link-err").html("");  
  }

  checkedOut(data);
}

function checkedOut(payload) {

  request('POST', payload, '/register', function(err, data){
    if(err == null) {
      if(data.error) {
        $("#email-err").html("Email already registered, please try with another email");
        $("#email").focus();
      }
      else {
        $("#email-err").html(""); 
      }

      if(data.load) {
        $('.login-input').focus().html('<p class="">Thank You for showing interest in CF Freelancer. We will review your profile and get back to you ASAP</p><p> Cheers Team CF !!!</p>');
      }
    }
    else {
      console.log('Error: ' + error.message);
      console.log("server connection error");
    }
  });
  
}

function request(method, data, url, callback) {
  $.ajax({
    type: method,
    data: data,
    url: url,
    dataType: "json",
    success: function (data) {
      callback(null,data);
    },
    error: function (xhr, status, error) {
      callback(error,null);
    }
  });    
}

function send(){

  var payload = {
    email:$("#email").val(),
    password:$("#password").val()
  };


  request('POST', payload, '/login', function(err, data){
    if(err == null) {
      if(data.error) {
        $("#errorshowmsg").show().html(data.error);
      }
      else {
        $("#errorshowmsg").html("");
      }

      if(data.load) {
        window.location = data.load;
      } 
    }
    else {
      console.log('Error: ' + error.message);
      console.log("server connection error");
    }
  });
}

function loginModalLoad(){
  $('#myModal').modal('show');
  loadLoginData();
}

function registerModalLoad(){
  _gaq.push(['_trackEvent', 'Register', 'Apply', 'CF Registration']);

  $('#openRegisterModal').modal('show');
  loadRegisterData();
}
function loadLoginData(){
  $('#myModal .modal-header').hide();
  var bodyHtml ='<div class="login-wrapper">\
  <div class="login-head">LOGIN</div>\
  <div class="login-input">\
  <label>\
  <span class="glyphicon glyphicon-user"></span>\
  <input type="text" id="email" placeholder="userid"/>\
  </label>\
  <label>\
  <span class="glyphicon glyphicon-lock"></span>\
  <input type="password" id="password" placeholder="pwd"/>\
  </label>\
  <p id="errorshowmsg" class="error-login"></p>\
  <input type="button" class="btn btn-primary bgBlk" value="Submit" onclick="send()" id="submit"/>\
  </div>\
  </div>';
  $('#myModal .modal-body').html(bodyHtml);
  $('#errorshowmsg').hide();
}
function loadLoginModal(){
  $('#myModal').modal('show');
  loadLoginData();
}
function loadRegisterData(){
  $('#openRegisterModal .modal-header').hide();

  var bodyHtml ='<div class="login-wrapper">\
  <div class="login-head">APPLY</div>\
  <div id="thankyou">\
  <p  class="success">Thank you for registering, taking you to login section in <span id="counter"></span></p>\
  </div>\
  <div class="login-input">\
  <div class="col-md-12"><label>\
  <span class="glyphicon glyphicon-user"></span>\
  <input id="fname" type="text" placeholder="First Name">\
  </label>\
  <div id="fname-err"></div>\
  <label>\
  <span class="glyphicon glyphicon-user"></span>\
  <input id="lname" type="text" placeholder="Last Name">\
  </label>\
  <div id="lname-err"></div>\
  <label>\
  <span class="glyphicon glyphicon-envelope"></span>\
  <input id="email" type="text" placeholder="Email Id">\
  </label>\
  <div id="email-err"></div>\
  <label>\
  <span class="glyphicon glyphicon-phone"></span>\
  <input id="contact" type="text" placeholder="Mobile Number">\
  </label>\
  <div id="contact-err"></div>\
  <label class="se">\
  <span class="glyphicon glyphicon-globe"></span>\
  <select id="tags">\
  </select>\
  </label>\
  <div id="city-err"></div>\
  <table id="addLinkTable" style="width:100%;">\
  <tr class="linkLabel">\
  <td>\
  <label class="linkLabel1">\
  <span class="glyphicon glyphicon-link"></span>\
  <input id="link" type="text" placeholder="Share past work link" />\
  <span class="btn btn-primary addLinkTextBox">+</span>\
  </label>\
  </td>\
  </tr>\
  </table><div id="link-err"></div><span class="addLinkError"></span>\
  </div>\
  <input type="button" class="btn btn-primary bgBlk" value="Submit" onclick="Validate()" id="submit"/>\
  <input type="button" data-dismiss="modal" class="btn btn-primary bgBlk closeBtnModal" value="Close"/>\
  </div>\
  </div>\
  </div>';
  $('#openRegisterModal .modal-body').html(bodyHtml);

  var availableTags = [
  "Select City",
  "Agra",
  "Ahmedabad",
  "Ajmer",
  "Alwar",
  "Amarnath",
  "Amravati",
  "Amritsar",
  "Anantapur",
  "Andaman & Nicobar ",
  "Aurangabad",
  "Baghpat",
  "Bahadurgarh",
  "Baloda Bazar",
  "Bangalore",
  "Bathinda",
  "Beawar",
  "Belgaum",
  "Bellary",
  "Bhiwadi",
  "Bhopal",
  "Bhubaneswar",
  "Bijnor",
  "Bikaner",
  "Billhaur",
  "Bokaro",
  "Bulandshahar",
  "Calicut",
  "Chandigarh",
  "Changlang",
  "Chennai",
  "Chikkamaglur",
  "Chittoor",
  "Cochin & Ernakulam",
  "Coimbatore",
  "Cuttack",
  "Darjeeling",
  "Dehradun",
  "Delhi",
  "Dharuhera",
  "Domlur",
  "Durgapur",
  "East Godavari",
  "Faridabad",
  "Ganganagar",
  "Gangtok",
  "Gautam Buddha Nagar",
  "Ghaziabad",
  "Goa",
  "Greater Noida",
  "Gurgaon",
  "Guwahati",
  "Gwalior",
  "Haldwani",
  "Hapur",
  "Haridwar",
  "Holagunda",
  "Hyderabad",
  "Indore",
  "Jabalpur",
  "Jaipur",
  "Jaisalmer",
  "Jalandhar",
  "Jhansi",
  "Kadapa",
  "Kalaridha",
  "Kannauj",
  "Kanpur",
  "Kanteerava",
  "Kharagpur",
  "Kochi",
  "Kolar",
  "Kolhapur",
  "Kolkata",
  "Krishnagiri",
  "Lonavala",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mangalore",
  "Mohali",
  "Morbi",
  "Mumbai",
  "Mussoorie",
  "Mysore",
  "Nagarbhavi",
  "Nagpur",
  "Nainital",
  "Nashik",
  "Navi Mumbai",
  "Neemrana",
  "Noida",
  "Ooty",
  "Palwal",
  "Panchkula",
  "Panipat",
  "Patna",
  "Phaltan",
  "Pimpri-Chinchwad",
  "Pune",
  "Puri",
  "Raigarh",
  "Raipur",
  "Rajahmundry",
  "Rajkot",
  "Ranchi",
  "Rohtak",
  "Roorkee",
  "Rudrapur",
  "Sawai Madhopur",
  "Secunderabad",
  "Shimla",
  "Siliguri",
  "Singrauli",
  "Sirmaur",
  "Sonipat",
  "Surat",
  "Thane",
  "Tiruppur",
  "Trivandrum",
  "Udaipur",
  "Udupi",
  "Ujjain",
  "Vadodara",
  "Valsad",
  "Vellore",
  "Vijayawada",
  "Visakhapatnam",
  "Warangal",
  "Yamunanagar",
  "Yavatmal"
  ];

  var s = '';
  for (var i in availableTags){
    s+='<option value="'+availableTags[i]+'">'+availableTags[i]+'</option>'
  }

  $('#tags').append(s);
  $('#tags').select2();

  $("#thankyou").hide();



  $('.addLinkTextBox').click(function(){

   var l = $('#addLinkTable').find('tr').length ;
   if(l<3) {
    var html=' <tr class="">\
    <td>\
    <label class="linkLabel1">\
    <span class="glyphicon glyphicon-link"></span>\
    <input  type="text" placeholder="Share past work link" />\
    <span class="btn btn-primary deleteLinkTextBox">-</span>\
    </label>\
    </td>\
    </tr>';
  }
  else {
    $('.addLinkError').html('You can add only three links');
  }

  $('.linkLabel').after(html);

  $('.deleteLinkTextBox').click(function(){
    $(this).closest('tr').remove();
    $('.addLinkError').html('');
  });

});
}