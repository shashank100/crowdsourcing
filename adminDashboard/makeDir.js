var fs = require('fs'),
path = require('path');
module.exports={
	makeDirectoryStructure: function(localityNameDir,email,rawOrAcc){
		var folders=[
		'nightLife', 'transitPoints',
		'socialInfra', 'physicalInfra',
		'civicIssues', 'residentialUnits',
		'lifestyle', 'openspaces',
		'coverpic', 'localMarkets'
		];
		var that=this;
		var baseFolder=localityNameDir+'/'+email+'/';
		if(rawOrAcc == 0) {
			folders.forEach(function  (folder) {
				that.mkdirParent( baseFolder+folder+'/thumbnail','0777',function(err1){
				});
			});
		}
		else {
			folders.forEach(function  (folder) {
				that.mkdirParent( baseFolder+folder+'/','0777',function(err1){
				});
			});
		}
	},
	mkdirParent : function(dirPath, mode, callback) {
		var that=this;
		fs.mkdir(dirPath, mode, function(error) {
	    //When it fail in this way, do the custom steps
	    if (error && error.errno === -2) {
	      //Create all the parents recursively
	      that.mkdirParent(path.dirname(dirPath), mode, callback);
	      //And then the directory
	      that.mkdirParent(dirPath, mode, callback);
	  }
	    //Manually run the callback since we used our own callback to do all these
	    callback && callback(error);
	});
	}
}