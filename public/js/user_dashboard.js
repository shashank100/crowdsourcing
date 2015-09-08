
$(document).ready(function(){
  selectCity();
});


function mainError(error) {
 $('.mainErrorHandling').show();
 $('.mainErrorHandling .textA').html(error);
 $('.mainErrorHandling').fadeOut(5000);
}
var user_dashboard= {};
user_dashboard.global = 0;
user_dashboard.fileList;
user_dashboard.disableFileList = [];

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

function uploadImages() {

  var payload = {
    status: 0 //check if user has selected a locality
  };
  request('POST', payload, '/enquire', function(err, data){
    if(err == null) {
      if(data.error) {
        console.log("here");
       mainError(data.error);
     }
     else if(data.status == "0") { // no locality selected to shoot; Transfer to select Menu
      selectCity();
    }
    else if(data.status == "1") { // selected but admin has not approved.
      $('#data-1').html('<div class="subheader">Submit Work</div><div class="submitWork"><p>Selected Locality yet to be approved by admin</p></div>');
    }
    else if(data.status == "2") // selected and approved
    {
      $('#data-1').html('');
      submitselectedLocality();
    }
    else if(data.status == "logout") {
      window.location = data.status 
    }
  }
  else {
    console.log('Error: ' + error.message);
    console.log("server connection error");      
  }
});
}


function submitselectedLocality(){

  request('POST', '{}', '/findUsersSelectedLocality', function(err, data){
    if(err == null) {
      if(data.error) {
       mainError(data.error);
     }
     else if(data.status) {
      window.location = data.status;
    }
    else
    {
      if(data){
        var html = createDropdown(data);
        $('#data').show();
        $('#fileupload').hide();
        $('#localityCategoryDiv').html(html);
      } 
    }
  }
  else {
    console.log('Error: ' + error.message);
    console.log("server connection error");
  }
});

}


function createDropdown(data){

  var html = '<div class="col-md-12">\
  <div class="col-md-6 row" >\
  <select id="usersSelectedLocality" onchange="onchangeSelect()">\
  <option value="null">Selected Locality</option>';
  for(i in data) {
    html+=' <option value="'+data[i].locality_id+'">'+data[i].locality_name+'</option>';
  }; 
  html+= '</select></div>';

  html+='<div class="col-md-6">\
  <select id="locCategory" onchange="uploadImagesInSelectedFolder()" disabled="disabled">\
  <option value="null">select Category</option>\
  <option value="nightLife">Night Life</option>\
  <option value="transitPoints">Transit Points</option>\
  <option value="socialInfra">Social Infrastructure</option>\
  <option value="physicalInfra">Physical Infrastructure</option>\
  <option value="civicIssues">Civic Issue</option>\
  <option value="residentialUnits">Residential Units</option>\
  <option value="lifestyle">Lifestyle</option>\
  <option value="openspaces">Open Spaces</option>\
  <option value="coverpic">MastHead(coverpic)</option>\
  <option value="localMarkets">Local Markets</option>\
  </select></div>';

  html+='</div>';
  return html;
}


function uploadImagesInSelectedFolder(){
  $('.files').html('');
  var loc = $('#usersSelectedLocality').val();
  var locCat = $('#locCategory').val();
  if(loc != 'null' && locCat != 'null') {
    var payload = {
      locality: loc,
      locCategory: locCat
    }; 
    request('POST', payload, '/uploadImagesInSelectedFolder', function(err, data){
      if(err == null) {
        if(data.error) {
         mainError(data.error);
       }
       else if(data.status == "logout") {
        window.location = data.status;
      }
      else {
        $('#fileupload').show();
        imageGet();
      }
    }
    else {
     console.log('Error: ' + error.message);
     console.log("server connection error");
   }
 });
  }
  else {
    $('#fileupload').hide();
  }
}

function imageGet() {
  $('.files').html('');
  $('#fileupload').addClass('fileupload-processing');
  $.ajax({
    url: $('#fileupload').fileupload('option', 'url'),
    dataType: 'json',
    context: $('#fileupload')[0]
  }).always(function () {
    $(this).removeClass('fileupload-processing');
  }).done(function (result) {
    $(this).fileupload('option', 'done')
    .call(this, $.Event('done'), {result: result});
  });
}

function selectCity() {
  $('#data').hide();

  var html ='<div class="subheader">Select Locality</div>\
  <div class="selLocContent">\
  <div class="col-md-6">\
  <span class="locError"></span>\
  <table class="table selLocTable">\
  <tr>\
  <td>Select City</td>\
  <td>\
  <select id="city-select" onchange="selectLocality()">';
  html += '</select>\
  </td>\
  </tr>\
  <tr>\
  <td>Select Locality</td>\
  <td>\
  <select id="locality-select">\
  <option value="null">Select a Locality</option>\
  </select>\
  </td>\
  </tr>\
  <tr>\
  <td>start date</td>\
  <td><input type="text" id="start_date"/></td>\
  </tr>\
  <tr style="display:none;">\
  <td>End Date</td>\
  <td><input type="text" id="end_date" disabled/></td>\
  </tr>\
  <tr>\
  <td>&nbsp;</td>\
  <td><input type="button" class="btn" value="Submit" id="submitBtnLocSel" disabled/></td>\
  </tr>\
  </table>\
  </div>\
  <div class="col-md-6">\
  <h4>Guidelines For Locality selection.</h4>\
  <p>1.End Date is Automatically generated which is start date plus 15 days.</p>\
  <p>1.End Date is Automatically generated which is start date plus 15 days.</p>\
  <p>1.End Date is Automatically generated which is start date plus 15 days.</p>\
  </div>\
  <div class="col-md-12 locSelectionDetail">\
  </div>\
  </div>';

  $('#data-1').html(html);

  request('POST', {}, '/getCityUser', function(err, data) {
    if(data.error) {
      //manish handle error
    }
    else if(data.status) {
      window.location = data.status;
    }
    else if(err == null) {
      html = '<option value="null">Select a city</option>';
      for(var i = 0;i < data.length; i++)
        html+= '<option value="'+data[i].city+'">'+data[i].city+'</option>';
      $('#city-select').html(html);
    }
    else {
      console.log(err.message);
      console.log("Server connection error");
    }
  });


  $('#start_date').datepicker({minDate:0,dateFormat: 'yy/mm/dd',onSelect: function(dateStr) {
    var d = $.datepicker.parseDate('yy/mm/dd', dateStr);
        d.setDate(d.getDate() + 7); // Add 15 days
        $('#end_date').datepicker('setDate', d);
      }});
  $('#end_date').datepicker({dateFormat: 'yy/mm/dd'});

  callAjaxLocDetails();

  $('#locality-select').change(function(){
   var selectedLoc = $('#locality-select').val();
   checkForSelectedLoc(selectedLoc)
 });



  $('#submitBtnLocSel').click(function(){

    var city         = $('#city-select').val();
    var locality     = $('#locality-select').val();
    var start_date   = $('#start_date').val();
    var end_date     = $('#end_date').val();
    var status       = 'pendingFromAdmin';

    if(city == null || city =="") {
      $(".locError").html('<p class="error"> Select Any City</p>');
      $("#city-select").focus();
      return false;
    }
    else {
      $(".locError").html("");
    }

    if(locality == null || locality == "" ) {
      $(".locError").html('<p class="error"> Select Any locality</p>');
      $("#locality-select").focus();
      return false;
    }
    else {
      $(".locError").html("");
    }

    if(start_date == "" || start_date == null) {
      $(".locError").html('<p class="error"> Select Start Date</p>');
      $("#start_date").focus();
      return false;
    }
    else {
      $(".locError").html("");
    }

    selected();
  });
}

function selectLocality() {
 var payload = {
  status:1,
  city: $('#city-select').val()
};
request('POST', payload, '/enquire', function(err, data){
  if(err == null) {
    if(data.status == "logout") {
      window.location = data.status;
    }
    if(data.error) {
     mainError(data.error);
   }
   else {
    console.log(data.list);
    var html = '<option value="null">Select a Locality</option>';
    for(i = 0 ; i < data.list.length; i++)
     html += '<option value='+data.list[i].locality_id+'>'+data.list[i].locality_name+'</option>';
   $("#locality-select").html(html);
 }
}
else {
  console.log(err.message);
  console.log('Server connection error');
}
});

}

function selected() {

 var payload = {
   city         : $('#city-select').val(),
   locality     : $('#locality-select').val(),
   start_date   : $('#start_date').val(),
   end_date     : $('#end_date').val(),
   status       : 'pendingFromAdmin',
   locality_status : 'selectedWaitingApproval'
 };

 request('POST', payload, '/selection', function(err, data){
  if(err == null) {
    if(data.error) {
     mainError(data.error);
   }
   else if(data.status) {
    window.location = data.status;
  }
  else {
    $(".locError").html("successfully locality selection done");
    createTableLocalitySelectionDetail(data);
    selectCity();
  }
}
else {
  console.log(err.message);
  console.log('Server connection error');
}
});

}


function callAjaxLocDetails(chkClick){
  request('POST', '{}', '/selected_locality', function(err, data) {
    if(err == null) {
      if(data.status) {
        window.location = data.status;
      }
      else if(data.error) {
        //handle error manish
      }
      else {
        var html = createTableLocalitySelectionDetail(data);
        if(chkClick == 'chkClick') {
          $('#data').hide();
          var html1='<div class="subheader">Check Status</div>';
          html1+='<div class="chkStatus">'+html+'</div>';
          $('#data-1').html(html1);
        }
        else {        
          $('.locSelectionDetail').html(html);        }
        }
      }
      else {
        console.log(err.message);
        console.log('Server connection error');
      }
    });

}



function createTableLocalitySelectionDetail(data) {
  var html='<div class="subheader" style="margin-bottom:20px;">Selected Locality Status</div>\
  <table class="showLocTable table table-bordered table-responsive">\
  <tr>\
  <th>#SL No</th>\
  <th>City</th>\
  <th>Locality</th>\
  <th>Start Date</th>\
  <th>End Date</th>\
  <th>Status</th>\
  </tr>';
  for (var i in data) {   
    if(data.errorMsg) {
      html+='No Data Found';
    }
    else {
      var sl = parseInt(i)+1;
      html+='<tr>\
      <td>'+sl+'</td>\
      <td>'+data[i].locality_city+'</td>\
      <td>'+data[i].locality_name+'</td>\
      <td>'+data[i].start_date+'</td>\
      <td>'+data[i].end_date+'</td>\
      <td>'+data[i].status+'</td>\
      </tr>';
    }
  }
  html+='</table>';
  return html;

}


function checkForSelectedLoc(data){
  var payload = {
    localityId:data
  };

  request('POST', payload, '/chkSelectedLocality', function(err, data){
    if(err == null) {
      if(data.status) {
        window.location = data.status;
      }
      else if(data.status) {
        window.location = data.status;
      }
      else if(data.length >0) {
        $('#submitBtnLocSel').attr('disabled','disabled');
      } 
      else {
        $('#submitBtnLocSel').removeAttr('disabled');
      } 
    }
    else {
      console.log(err.message);
      console.log('Server connection error');
    }
  });  
}

function changePassword(){

 $('#data').hide();
 var html='<div class="subheader"> Change Password </div>';
 html+='<div class="editProfileContent"><h4> Change Password </h4>\
 <table class="table changePwdTbl">\
 <tr>\
 <th>New Password</th>\
 <td><input type="text" id="oldPwd"></td>\
 </tr>\
 <tr>\
 <th>Confirm New Passwotrd</th>\
 <td><input type="text" id="newPwd"></td>\
 </tr>\
 <tr>\
 <th>&nbsp;</th>\
 <td><button onclick="submitChangePwd()">Submit</button></td>\
 </tr>\
 </table><div class="col-md-12 errorMsgChngPwd"></div>\
 </div>';
 $('#data-1').html(html);

}


function submitChangePwd(){

  var opwd= $('#oldPwd').val();
  var newPwd= $('#newPwd').val();

  if(opwd == '' || opwd==null) {
    $('.errorMsgChngPwd').html("<span style='color:red;'>Please enter New Password.</span>");
    return false;
  }
  else {
    $('.errorMsgChngPwd').html("");
  }

  if(newPwd == '' || newPwd==null){
    $('.errorMsgChngPwd').html("<span style='color:red;'>Please enter Confirm New Password.</span>");
    return false;
  }
  else {
    $('.errorMsgChngPwd').html("");
  }


  if(newPwd != opwd){
    $('.errorMsgChngPwd').html("<span style='color:red;'>Not matching.</span>");
    return false;
  }
  else {
    $('.errorMsgChngPwd').html("");
  }

  var payload = {
    oPwd:opwd,
    newPwd:newPwd
  };
  request('POST', payload, '/changePwd', function(err, data){
    if(err == null) {
     if(data.error){
       $('.errorMsgChngPwd').html("<span style='color:red;'>previous password bot correct.</span>");
     }
     else {
      $('.errorMsgChngPwd').html("<span style='color:green;'>password changed successfully.</span>");
    }
  }
  else {
    console.log(err.message);
    console.log('Server connection error');
  }
});

}


function needHelp(){
 $('#data').hide();
 var html='<div class="subheader">Need Help</div>';
 html+='<div class="needHelp">Under COnstruction</div>';
 $('#data-1').html(html);
}



var someCallback = function(exifObject) {

  if(exifObject && exifObject.GPSLatitude && exifObject.GPSLongitude) {
    var lat = (exifObject.GPSLatitude[0]+exifObject.GPSLatitude[1]/60+exifObject.GPSLatitude[2]/3600);
    var lng = (exifObject.GPSLongitude[0]+exifObject.GPSLongitude[1]/60+exifObject.GPSLongitude[2]/3600);
    var x = localStorage.getItem('geocode');
    checkPolygon(lat,lng,x,exifObject);
  }
  else {
    user_dashboard.disableFileList.push(user_dashboard.fileList[user_dashboard.global].name); 
  }
  user_dashboard.global++;
};


$('#file').change(function() {
 user_dashboard.fileList = $(this)[0].files;
 user_dashboard.global = 0;
 $(this).fileExif(someCallback);
});

function checkPolygon(lat,lng,geocode,exifObject) {
 var decodedPoly = new google.maps.geometry.encoding.decodePath(geocode);
 var poly = new google.maps.Polygon({
   paths: decodedPoly
 });
 var isInside = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(lat,lng),poly);
 if(isInside == false) {
   user_dashboard.disableFileList.push(user_dashboard.fileList[user_dashboard.global].name);
 }
}

var getInfo = function(exifObject) {
  var aLat = exifObject.GPSLatitude;
  var aLong = exifObject.GPSLongitude;
  var strLatRef = exifObject.GPSLatitudeRef || "N";
  var strLongRef = exifObject.GPSLongitudeRef || "W";
  var fLat = (aLat[0] + aLat[1]/60 + aLat[2]/3600) * (strLatRef == "N" ? 1 : -1);
  var fLong = (aLong[0] + aLong[1]/60 + aLong[2]/3600) * (strLongRef == "W" ? -1 : 1);
}


$('#fileupload').bind('fileuploadsend', function(e,data) {
 for(var j = 0 ; j < user_dashboard.disableFileList.length; j++) {
   if(user_dashboard.disableFileList[j] == data.files[0].name)
     return false;
 }
      return data.files;
});



function onchangeSelect() {
  var check = $('#usersSelectedLocality').val();
  if(check != "null") {
    var payload = {
      locality: $("#usersSelectedLocality").val()
    };    

    request('POST', payload, '/getPolygon', function(err, data){
      if(err == null) {
        if(data.error) {
           // handle error mainsh
         }
         else if(data.status) {
           window.location = data.status;
         }
         else {
           var geocode =  data[0].geocode_polygon_json;
           localStorage.setItem('geocode',geocode);
         }
       }
       else {
        console.log(err.message);
        console.log('Server connection error');
      }
    });  
    $('#locCategory').removeAttr('disabled');
  }
  else {
    $('#locCategory option[value="null"]').prop('selected', true);
    $('#locCategory').attr('disabled','disabled');
  }
    $('#locCategory option[value="null"]').prop("selected", true);
    $('.files').html('');
    $('#fileupload').hide();
}



function selectChangeLocality() {

  var payload = {
    status:2,
    city: $('#city-select').val()
  };

  request('POST', payload, '/enquire', function(err, data) {
    if(err == null){
      if(data.error) {
       mainError(data.error);
     }
     else if (data.status == "logout") {
      window.location = data.status;
    } 
    else {
      var html = '<option value="null">Select a Loccality</option>';
      for(i = 0 ; i < data.list.length; i++)
        html += '<option value='+data.list[i].locality_id+'>'+data.list[i].locality_name+'</option>';
      $("#locality-select").html(html);
    }
  }
  else {
    console.log(err.message);
    console.log('Server connection error');
  }
});   
}

function logout() {
  window.location = 'logout';
}

function selectLocalityNew() {
  var payload = {
    status:1,
    city: $('#city-select').val()
  };

  request('POST', payload, '/enquire', function(err, data) {
    if(err == null){
      if(data.error) {
       mainError(data.error);
     }
     else if (data.status == "logout") {
      window.location = data.status;
    } 
    else {
     var html = '<option value="null">Select a Loccality</option>';
     for(i = 0 ; i < data.list.length; i++)
      html += '<option value='+data.list[i].locality_id+'>'+data.list[i].locality_name+'</option>';
    $("#locality-select-new").html(html);
  }
}
else {
  console.log(err.message);
  console.log('Server connection error');
}
});   
}


function showSubmit() {
  if($("#locality-select-new").val() != "null")
    $("#submitBtnLocChnge").prop("disabled",false);
  else
    $("#submitBtnLocChnge").prop("disabled",true);
}


$('#fileupload').bind('fileuploadstart', function(e) {
  $('#usersSelectedLocality').attr('disabled', true);
  $('#locCategory').attr('disabled', true);
  $('.list-group-item').attr('disabled', true);
});

$('#fileupload').bind('fileuploadstop', function(e) {
  $('#usersSelectedLocality').removeAttr('disabled');
  $('#locCategory').removeAttr('disabled');
  $('.list-group-item').removeAttr('disabled');
});

