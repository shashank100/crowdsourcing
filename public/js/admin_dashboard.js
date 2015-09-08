$(document).ready(function(){
 approveLocality();
 workSubmitted();
 newProfiles();
}); 

function mainError(error){

   $('.mainErrorHandling').show();
   $('.mainErrorHandling .textA').html(error);
   $('.mainErrorHandling').fadeOut(5000);

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

function newProfiles() {
	var html = '<div class="col-md-12">\
               <label class="subHeader">List of New Users</label>\
               <table class="table newUsers">\
                 <thead>\
                   <tr>\
                     <th>#Sl No</th>\
                     <th>Firstname</th>\
                     <th>Lastname</th>\
                     <th>Email</th>\
                     <th>Work Link</th>\
                     <th>Verdict</th>\
                   </tr>\
                 </thead>\
               <tbody>';

 request('POST', '{}', '/profiles', function(err, data) {
  if(err == null) {
    if(data.status) {
      window.location = data.status;
    }
    else {
      if(data.error) {
       mainError(data.error);
      }
      else if(data.length == 0) {
        $("#data .contetnArea").html('<label class="subHeader">No new profiles</label>');
      }
      else {
        for(var i = 0; i < data.length; i++) {

          var sl = parseInt(i)+1;

          html +='<tr id="'+data[i].user_id+'">\
                    <td><p>'+sl+'</p></td>\
                    <td><p>'+data[i].firstname+'</p></td>\
                    <td><p>'+data[i].lastname+'</p></td>\
                    <td><p>'+data[i].email+'</p></td>\
                    <td><a href="'+data[i].link+'" target="_blank">'+data[i].link+'</a></td>\
                    <td class="actionButtons">\
                    <button class="btn btn-success" onclick="approve('+data[i].user_id+')">Approve</button>\
                    <button class="btn btn-danger" onclick="reject('+data[i].user_id+')">Reject</button>\
                    </td>\
                  </tr>';
        }
        html += '</tbody>\
        </table>\
        </div>';
        $(".contetnArea").html(html);
        $('#newProfiles .badge').html(data.length); 
      }
    }
  }
  else {
    console.log('Error:' + err.message);
    console.log('Server connection error');
  }
});

}

function approve(val) {
  var payload = {
    status:1,
    user_id: val
  };

  request('POST', payload, '/status', function(err, data){
    if(err == null) {
     if(data.error) {
         mainError(data.error);
      }
      else if(data.status) {
        window.location = data.status;
      }
      else {
       $('#'+val).remove();
       var num_of_notifications = parseInt($('#newProfiles .badge').text());
       $('#newProfiles .badge').html(num_of_notifications-1);
     }
   }
   else {
    console.log('Error:' + err.message);
    console.log('Server connection error');
  }
});   
}

function reject(val) {
  var payload = {
    status:0,
    user_id: val
  };

  request('POST', payload, '/status', function(err, data){
    if(err == null) {
      if(data.status) {
        window.location = data.status;
      }
      else if(data.error) {
       mainError(data.error);
      }
      else {
       $('#'+val).remove();
       var num_of_notifications = parseInt($('#notification').text());
       $('#notification').html(num_of_notifications-1);
       location.reload();
     }
   }
   else {
    console.log('Error:' + err.message);
    console.log('Server connection error');
  }
});   
}

function workSubmitted() {
  var html = '<div class="col-md-12">\
  <div class="row seePicsDropdownDiv"></div>\
  <label class="subHeader">List of Approved Users</label>\
  <table class="table submittedprofiles">';

  request('POST', '{}', '/worksubmitted', function(err, data){
    if(err == null) {
     if(data.error) {
        // hanle error manish
      }
      else if(data.status) {
        window.location = data.status;
      }
      else {
        if(data.length == 0) {
          $(".contetnArea").html('<label class="subHeader">No one approved yet</label>');
        }
        else {

          html+='<tr>\
                    <th>#Sl No</th>\
                    <th>Name</th>\
                    <th>Email</th>\
                    <th>See Pics</th>\
                  </tr>';

          for(var i = 0; i < data.length; i++) {
           var sl = parseInt(i)+1;
           html +='<tr id="'+data[i].user_id+'">\
                     <td><p>'+sl+'</p></td>\
                     <td><p>'+data[i].firstname+' '+data[i].lastname+'</p></td>\
                     <td><p>'+data[i].email+'</p></td>\
                     <td>\
                      <select id="seeAllPics" onchange="getLocalityofApprovedUsers(\''+data[i].user_id+','+data[i].email+'\')">\
                         <option value="null">Select Option</option>\
                         <option value="uploaded">All Pics</option>\
                         <option value="selected">Selected Pics</option>\
                         <option value="rejected">Rejected Pics</option>\
                      </select>\
                      </td>\
                   </tr>';


                     //<button class="btn btn-default"  onclick="getLocalityofApprovedUsers(\''+data[i].user_id+','+data[i].email+'\')">See Pics</button>\
                     
         }
         html += '</tbody>\
         </table>\
         <div class="row imageDisplayDiv"></div>\
         </div>';


         $(".contetnArea").html(html);  
         $('#approvedUsers .badge').html(data.length)
       }
     }
   }
   else {
    console.log(err.message);
    console.log('Server connection error');
  }
});

}

function getLocalityofApprovedUsers (d) {

  var a = d.split(',');
  var userId = a[0];
  var email = a[1];
  var payload = {userId: userId};

  var v = $('#seeAllPics').val();

  if( v ==  'null'){
    $('.seePicsDropdownDiv').hide();
  }else{

           $('.seePicsDropdownDiv').show();
          request('POST', payload, '/getLocalityofApprovedUsers', function(err, data){
              if(err == null) {
               if(data.error) {
                 mainError(data.error);
                }
                else if(data.status) {
                  window.location = data.status;
                }
                else {
                  if(data.length == 0 || data == ''){
                    var html='<div class="col-md-12">No pics Uploaded yet.</div>'
                    $('.seePicsDropdownDiv').html(html);

                  }else{
                   createLocCategoryHtml(data, email, userId , v);
                 }
               }
             }
             else {
              console.log(err.message);
              console.log('Server connection error');
            }
          });   


      }

}

function createLocCategoryHtml (data,email, userId, v) {

 var html ='<div class="col-md-12">\
               <label class="subHeader">Select The category you want to view</label>\
               <div class="col-md-4" style="padding-left:0px;">\
               <select id="getCItyName">\
               <option value="null">Select City</option>';
               html+='<option value="'+data[0].locality_city+'">'+data[0].locality_city+'</option>';
               html+='</select>\
             </div>';

       html+='<div class="col-md-4">\
           <select id="getLocalityName">\
           <option value="null">Select Locality</option>';   
           for(i in data) {
            html+=' <option value="'+data[i].locality_id+'">'+data[i].locality_name+'</option>';
           }; 
       html+='</select>\
</div>';

      html+='<div class="col-md-4">\
                <select id="locCategory">\
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
                </select>';

      html+='<button class="btn btn-primary pull-right" onclick="getWork(\''+userId+','+email+','+v+'\')">go</button></div>';
      html+'</div>';


              html+='<div class="col-md-12 showPicsError"></div>';

$('.seePicsDropdownDiv').html(html);

}

$('#getCItyName').change(function() {
  alert($('#getCItyName').val());
});

function getWork(d) {

  var cityDropDown = $('#getCItyName').val();
  var getLocalityName = $('#getLocalityName').val();
  var locCategory = $('#locCategory').val();

  if(cityDropDown == 'null'){
    $('.showPicsError').html('<div class="row picsError" >Please select City</div>');
    return false;

  }else{
     $('.showPicsError').html('');
  }

   if(getLocalityName == 'null'){
    $('.showPicsError').html('<div class="row picsError" >Please select Location</div>');
    return false;

  }else{
     $('.showPicsError').html('');
  }

   if(locCategory == 'null'){
    $('.showPicsError').html('<div class="row picsError" >Please select Category</div>');
    return false;

  }else{
     $('.showPicsError').html('');
  }


  var a = d.split(',');
  var city = $('#getCItyName').val();
  var localityid = $('#getLocalityName').val();
  var category = $('#locCategory').val();
  var userId = a[0];
  var email = a[1];
  var imageStatus = a[2];

  var payload = { 
                  city: city,
                  locality_id:localityid, 
                  category:category,
                  userId:userId,
                  email:email,
                  imageStatus:imageStatus
                };





  request('POST', payload, '/getwork', function(err, data) {
    if(err == null) {
      if(data.error) {
        $('.showPicsError').html('<div class="row picsError" >'+data.error+'</div>')
      }
      else if(data.status) {
        window.location = data.status;
      }else{
       showPics(data, imageStatus);
     }

   }
   else {
    console.log(err.message);
    console.log('Server connection error');
  }
});

}

function showPics(data,imageStatus){

         var html ='';
         if(data.length==0 || data == ''){
                           $('.showPicsError').html('<div style="color:red;padding:10px 0px 10px 0px;">No images found of this category</div>');
         }else{
                 $('.showPicsError').html('');
          
                 var indicators='';
                 var imgDiv='';
                 var iconHtml='';
                 var changImgCat='';
                 var c ='';
                 for (i in data){

                  //onchange="callChangeCate(\''+data[i].image_id+'\')

                  var changImgCat = ' <select class="pull-right" data-id="'+data[i].image_id+'">\
                                      <option value="null">Change Category</option>\
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
                                  </select>';

                    if(i < 1){
                         c ="active";
                         indicators+='<li data-target="#myCarousel" data-slide-to="'+i+'" class="'+c+'"></li>';
                         imgDiv+='<div class="modalImg item '+c+'" >\
                                      <img  name="'+data[i].image_name+'" src="'+data[i].image_location+'" style="height:100%;width:100%;">\
                                      <div class="row selectRejectDiv">\
                                        <div class="mar col-md-6 pull-right">\
                                          <span class="'+imageStatus+'Sel">\
                                            <input type="radio"   name="'+data[i].image_name+'" data-id="'+data[i].image_id+'" value="1" />Select\
                                          </span>\
                                          <span class="'+imageStatus+'Rej">\
                                            <input type="radio"   name="'+data[i].image_name+'" data-id="'+data[i].image_id+'" value="0" />Reject\
                                          </span>\
                                        </div>\
                                        <div class="col-md-6 pull-left changeImgCategory">'+changImgCat+'</div>\
                                      </div>\
                                  </div>';
                    }else{
                          indicators+='<li data-target="#myCarousel" data-slide-to="'+i+'"></li>';
                          imgDiv+='<div class="item modalImg">\
                                      <img name="'+data[i].image_name+'" src="'+data[i].image_location+'" style="height:100%;width:100%;">\
                                      <div class="row selectRejectDiv">\
                                        <div class="mar col-md-6 pull-right">\
                                          <span class="'+imageStatus+'Sel">\
                                            <input type="radio"   name="'+data[i].image_name+'" data-id="'+data[i].image_id+'" value="1" />Select\
                                          </span>\
                                           <span class="'+imageStatus+'Rej">\
                                            <input type="radio"   name="'+data[i].image_name+'" data-id="'+data[i].image_id+'" value="0" />Reject\
                                          </span>\
                                         </div>\
                                         <div class="col-md-6 pull-left changeImgCategory">'+changImgCat+'</div>\
                                      </div>\
                                   </div>';
                    }
                     iconHtml+='<a href="#" data-id="'+data[i].image_name+'">'+data[i].image_name+'<span class="glyp"></span></a>';

                 }//end of for loop
                  html+='<div class="modalWrap">\
                            <div class="row col-md-10">\
                              <div id="myCarousel" class="carousel slide" data-ride="carousel">\
                                  <ol class="carousel-indicators">\
                                  '+indicators+'\
                                  </ol>\
                                  <div class="carousel-inner " role="listbox">\
                                  '+imgDiv+'\
                                  </div>\
                                  <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">\
                                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>\
                                    <span class="sr-only">Previous</span>\
                                  </a>\
                                  <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">\
                                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>\
                                    <span class="sr-only">Next</span>\
                                  </a>\
                              </div>\
                            </div>\
                            <div class="row" id="iconView"><div class="col-md-2">'+iconHtml+'</div></div>';
                    html+='<div class="col-md-12 submitDiv" style="padding:0px;">\
                              <div class="col-md-6 errorSubmit" style="padding:0px;color:red;">\
                              </div>\
                              <div class="col-md-6" style="padding:0px;" >\
                                  <button class="btn btn-primary pull-right" id="submitImages">Submit</button>\
                              </div>\
                            </div>\
                      </div>'; 

                $('#myAdminModal').modal('show');
                $('.modal-body').html(html);
                $('#myCarousel').carousel('pause');
                $('#iconView').html(iconHtml);

                $('#slideLink').click(function(){
                    $('#myCarousel').show();
                    $('#iconView').hide();
                });

                $('#iconLink').click(function(){
                    $('#myCarousel').hide();
                    $('#iconView').show();
                });

                 $('#myCarousel .modalImg .selectRejectDiv span').find('input').click(function(){

                    var s = $(this).attr('name');
                    var v = $(this).val();
                    $('#iconView a').each(function(){
                      if( s ==  $(this).data('id') ){
                        if( v == '1'){
                             $(this).find('.glyp').html('<i style="margin-left:10px;" class="glyphicon glyphicon-ok"></i>');
                        }else{
                             $(this).find('.glyp').html('<i style="margin-left:10px;" class="glyphicon glyphicon-remove"></i>');
                        }
                      }
                    });
                 });   

               $('#iconView a').click(function(){
                   var n = $(this).data('id');
                  $('#myCarousel .item').each(function(){
                      if(n == $(this).find('img').attr('name')){
                          $('#myCarousel .item').each(function(){
                              $(this).removeClass('active');
                          });
                         $(this).addClass('active');
                      }
                  });
               });


               $('#submitImages').click(function(){

                   var selImg = {};
                   var rejImg = {};
                   var selected = [];
                   var rejected = [];

                    $('#myCarousel .modalImg').each(function(){
                       
                        var rv = $(this).find('.selectRejectDiv input[type="radio"]:checked').val() ;

                      if( rv == 1)
                        selected.push($(this).find('input[type="radio"]').data('id'));
                      else
                        if( ( rv == '0' && imageStatus == 'uploaded') || ( rv == '0' &&  imageStatus == 'selected')  ){
                            rejected.push($(this).find('input[type="radio"]').data('id')); 
                        }
                        
                        if( imageStatus == 'uploaded'){
                            if( $(this).find('input[type="radio"]:checked').val()  == undefined){
                               $('.errorSubmit').html('<span>Please select / reject all the images</span>');
                            }else{
                               $('.errorSubmit').html('');
                            }
                        }

                        
                    });


                  
                   selImg['selected'] = selected;
                   rejImg['rejected'] = rejected;

                   
    
                   var payloadSel = selImg;

                   request('POST', payloadSel, '/selectVerdict', function(err, data){
                    if(err ==  null) {
                       $('#myAdminModal').modal('hide');

                    }
                    else {
                      console.log(err.message);
                      console.log('Server connection error');
                    }
                   
                   });  

                   var payloadRej = rejImg;
                   request('POST', payloadRej, '/rejectVerdict', function(err, data) {

                    if(err == null) {
                       $('#myAdminModal').modal('hide');

                    }
                    else {
                      console.log(err.message);
                      console.log('Server connection error');
                    }
                   }); 
               });       


              $('.changeImgCategory').find('select').on('change',function(){      
                 alert(  $(this).data('id') +"---"+$(this).val());
                 var payload = {
                    image_id : $(this).data('id'),
                    category : $(this).val()
                 };
                 request('POST', payload, '/changeCategory',function(err, data) {
                    if(err == null) {
                      if(data.error) {
                        //manish handle error
                      }
                      else if(data.status == "logout") {
                        window.location = data.status;
                      }
                      else {
                        alert(data[0].image_id);
                        // manish handle response
                      }
                    }
                    else {
                      console.log("server connection error");
                    }
                 });
              });
         }

}



function approveLocality() {

  request('POST', '{}', '/approveLocality', function(err, data){
    if(err == null) {
      if(data.error) {
       mainError(data.error);
      }
      else if(data.status) {
        window.location = data.status;
      }
      else
      {
        if(data.length == 0) {
          $(".contetnArea").html('<label class="subHeader">No one localities to approve yet</label>');
        }
        else {
          var html = '<div class="col-md-12">\
                        <label class="subHeader">List of New Users</label>\
                        <table class="table newUsers">\
                          <thead>\
                            <tr>\
                              <th>#Sl No</th>\
                              <th>Name</th>\
                              <th>Email</th>\
                              <th>Selected Locality</th>\
                              <th>Verdict</th>\
                            </tr>\
                          </thead>\
                        <tbody>';

          for(var i in data) {
            
           var sl = parseInt(i)+1;

               html +='<tr id="'+data[i][0].user_id+data[i][0].locality_id+'">\
                         <td><p>'+sl+'</p></td>\
                         <td><p>'+data[i][0].firstname+' '+data[i][0].lastname+'</p></td>\
                         <td><p>'+data[i][0].email+'</p></td>\
                         <td><p>'+data[i][0].locality_name+'</p></td>\
                         <td class="actionButtons">\
                           <button class="btn btn-success" onclick="approveSelectedLocality('+data[i][0].user_id+','+data[i][0].locality_id+')">Approve</button>\
                           <button class="btn btn-danger" onclick="rejectSelectedLocality('+data[i][0].user_id+','+data[i][0].locality_id+')">Reject</button>\
                         </td>\
                        </tr>';
            }
               html += '</tbody>\
               </table>';

         $(".contetnArea").html(html);  
         $('#approveLocality .badge').html(data.length)
       }
     }
   }
   else {
    console.log(err.message);
    console.log('Server connection error');
  }
});
}

function approveSelectedLocality(user,locality) {

  var payload = {
    'user_id': user,
    'locality_id':locality
  };
  request('POST', payload, '/approveSelectedLocality', function(err, data){
    if(err == null) {
      if(data.error) {
       mainError(data.error);
      }
      else if(data.status) {
        window.location = data.status;
      }
      else {
        $('#'+user+locality).remove();
        var num_of_notifications = parseInt($('#approveLocality .badge').text());
        $('#approveLocality .badge').html(num_of_notifications-1);
      }
    }
    else {
      console.log(err.message);
      console.log('Server connection error');
    }
  });
}

function rejectSelectedLocality(user, locality) {
  var payload = {
    'user_id': user,
    'locality_id':locality
  };
  request('POST', payload, '/rejectSelectedLocality', function(err, data){
    if(err == null) {
      if(data.error) {
       mainError(data.error);
      }
      else if(data.status == "logout") {
        window.location = data.status;
      }
      else {
        $('#'+user).remove();
        var num_of_notifications = parseInt($('#approveLocality .badge').text());
        $('#approveLocality .badge').html(num_of_notifications-1);
      }
    }
    else {
      console.log(err.message);
      console.log('Server connection error');
    }
  });

}

function openImageModal (link) {
  var x = link.split(',');
  var path = x[0]+'/'+x[1] ;
}

function sendToFTP(){


  var html ='<div class="col-md-12">\
              <label class="subHeader">Upload Files to FTP</label>\
            </div>\
            <div class="col-md-6">\
              <select id="ftpCity" onchange="generateFTPDropdowns()">\
              </select>\
            </div>';

         html+='<div class="col-md-6" id="locDropdownFtp"></div>\
                <div class="col-md-12 ftpErrorDiv"></div>';

        $(".contetnArea").html(html);
request('POST', {}, '/getCity', function(err, data) {
    if(err != null || data.err) {
      console.log(err, data.err);
      $(".ftpErrorDiv").html('<p>Some error occured</p>');
    }
    else if(data.status) {
      window.location = data.status;
    }
    else {
      var html ='<option value="null">Select City</option>'; 
              for(var i = 0;i < data.length; i++) {
                html+= '<option value="'+data[i].city+'">'+data[i].city+'</option>'
              }
      $('#ftpCity').html(html);
      }

  });
}

function generateFTPDropdowns(data){

   var v = $('#ftpCity').val();

   if(v == 'null'){
      $('.ftpErrorDiv').html('Please Select A city.');
      $('#locDropdownFtp').html('');
      return false;

   }else{
      $('.ftpErrorDiv').html('');
   }
   var payload = {
    'city': v
   };

   request('POST',payload, '/getFTPLocality', function(err, data){
    if(err == null) {
      if(data.error) {
       mainError(data.error);
      }
      else if(data.status == "logout") {
        window.location = data.status;
      }
      else {

        var html =  '<select id="ftpLocality">';

                 for(var i in data){
                     html+='<option value="'+data[i].locality_name+'">'+data[i].locality_name+'</option>';
                 } 
            html+= '</select>\
              <button class="btn btn-primary pull-right" onclick="compressAndSend()">Submit</button>';

              $('#locDropdownFtp').html(html);
        
      }
    }
    else {
      console.log(err.message);
      console.log('Server connection error');
    }
  });
}

function compressAndSend() {
  var payload = {
    city: $('#ftpCity').val(),
    locality: $('#ftpLocality').val()
  };
  request('POST',payload, '/compress', function(err, data) {
    if(err == null) {

    }
    else {
      console.log(err.message);
      console.log('Server connection error');
    }
  });
}

function addLocality() {

  var html ='<div class="col-md-12">\
              <label class="subHeader">Add Localities to shoot</label>\
            </div>\
            <div class="col-md-12">\
               <div class="addLocalityContent">\
               </div>\
               <div class="errorMsg"></div>\
            <div>\
            <hr>\
            <div class="col-md-12">\
               <div class="addCityContent">\
                <table class="table changePwdTbl">\
                   <tr>\
                     <th>Add New City</th>\
                     <td><input type="text" id="cityName"></td>\
                   </tr>\
                   <tr>\
                     <th>&nbsp;</th>\
                     <td><button onclick="validateAddCity()">Submit</button></td>\
                   </tr>\
                 </table>\
                </div>\
               <div class="errorMsgCity"></div>\
            <div>';
$(".contetnArea").html(html); 
  request('POST', {}, '/getCity', function(err, data) {
    if(err != null || data.err) {
      console.log(err, data.err);
      $(".contetnArea").html('<p>Some error occured</p>');
    }
    else if(data.status) {
      window.location = data.status;
    }
    else {
      
      var html = '<table class="table">\
                 <tr>\
                    <th>Locality Name</th>\
                    <td><input type="text" id="locName"></td>\
                 </tr>\
                 <tr>\
                    <th>Locality City</th>\
                    <td><select id="locCity"><option value="null">Select City</option>';
              for(var i = 0;i < data.length; i++)
                html+= '<option value="'+data[i].city+'">'+data[i].city+'</option>'
                    
            html+= '</select></td>\
                 </tr>\
                 <tr>\
                    <th>Locality polygon</th>\
                    <td><input type="text" id="polygon"></td>\
                 </tr>\
                 <tr>\
                    <th>&nbsp;</th>\
                    <td><button onclick="validateAddLocality()">Submit</button></td>\
                 </tr>\
               </table>';

      $('.addLocalityContent').html(html);
    }
  });
  
}

function validateAddLocality() {
  if($('#polygon').val() == "" || $('#locName').val() == "" || $('#locCity').val() == "null") {
    $('.errorMsg').html('<p>Please fill all fields correctly</p>');
    console.log('herr');
    return false;
  }
  else {
    $('.errorMsg').html('');
    sendAddLocality();
  }
}

function validateAddCity() {
  if($('#cityName').val() == '') {
    $('.errorMsgCity').html('<p>Please fill city name</p>');
    return false;
  }
  else {
    $('.errorMsg').html('');
    sendAddCity();
  }
}


function sendAddLocality() {
  var payload = {
    locality_name: $('#locName').val(),
    locality_city: $('#locCity').val(),
    polygon      : $('#polygon').val() 
  };

  request('POST', payload, '/addLocality', function(err, data) {
    if(err == null) {
      $('.errorMsg').html('<p>'+data.message+'</p>')
    }
    else if(data.status) {
      window.location = data.status;
    }
    else {
      console.log(err.message);
      console.log("server error");
    }
  });
}

function sendAddCity() {
  var payload = {
    city: $('#cityName').val(),
  };

  request('POST', payload, '/addCity', function(err, data) {
    if(err == null) {
      $('.errorMsgCity').html('<p>'+data.message+'</p>')
    }
    else {
      console.log(err.message);
      console.log("server error");
    }
  });
}