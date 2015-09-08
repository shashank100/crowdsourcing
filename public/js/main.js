/*
 * jQuery File Upload Plugin JS Example 8.9.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global $, window */

$(function () {
    'use strict';

    //check for duplicate upload
    $('#fileupload').bind('fileuploadadd', function(e,data) {

        var currentfiles = [];
        $(this).fileupload('option').filesContainer.children().each(function(){
            currentfiles.push($.trim($('.name', this).text()));
        });

        data.files = $.map(data.files, function(file,i){
            if ($.inArray(file.name,currentfiles) >= 0) { 
                alert("same"+file.name+" is already uploaded.");
                return null; 
            }
            return file;
        });
        $('.fileupload-loading').hide();

    });



    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: '/imgUpload'
    });

    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
            /\/[^\/]*$/,
            '/cors/result.html?%s'
        )
    );
});