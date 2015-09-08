var express = require('express'),
fs = require('fs'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res) {
	if(req.session && req.session.user && req.session.role == "admin") {
		if(req.body.selected != undefined) {
			var selected = '';
			for(var i = 0; i < req.body.selected.length -1 ;i++)
				selected += req.body.selected[i]+',';
			selected += req.body.selected[req.body.selected.length-1];

			query.query('UPDATE locality_image SET status="move_in_progress" WHERE image_id in ('+selected+')',[],function(err, results,fields){
				if(err) {
					logger.info(err);
					res.json({error:"Some error occured"});
				}
				else {
					query.query('SELECT image_location FROM locality_image WHERE image_id in ('+selected+')',[] ,function(err, results, fields) {
						if(err) {
							logger.info(err);
							res.json({error: "Some error occured"});
						}
						else {
							var i = 0;
							for(var j = 0; j < results.length;j++) {
								move(results[i].image_location.split('/'));
								i++;
							}
							res.json({yo:"yo"});
						}
					});
				}
			});	
		}
		else {
			res.json({msg: "no one selected to select"});
		}
	}
	else {
		res.json({status: "logout"});
	}
});

function move(path) {
	fs.readFile('./public'+'/'+path[0]+'/'+path[1]+'/'+path[2]+'/'+path[3]+'/'+path[4]+'/'+path[5]+'/'+path[6], function(err, data) {
		if(err) {
			logger.info(err);
		}
		else {
			logger.info("here");
			fs.writeFile('./public/files/selected'+'/'+path[2]+'/'+path[3]+'/'+path[4]+'/'+path[5]+'/'+path[6], data, function(err) {
				if(err)
					logger.info(err);
				var param = path[0]+'/'+path[1]+'/'+path[2]+'/'+path[3]+'/'+path[4]+'/'+path[5]+'/'+path[6];
				query.query('UPDATE locality_image SET status="selected" WHERE image_location=?', [param], function(err, results, fields) {
					if(err) {
						logger.info(err);
						query.query('UPDATE locality_image SET status="uploaded" WHERE image_location=?', [param], function(err, results, fields) {})
					}
				});
			});
		}
	});
}
module.exports = router;