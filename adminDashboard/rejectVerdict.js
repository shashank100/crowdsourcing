var express = require('express'),
fs = require('fs'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res) {
	if(req.session && req.session.user && req.session.role == "admin") {
		if(req.body.rejected != undefined) {
			var rejected = '';
			for(var i = 0; i < req.body.rejected.length -1 ;i++)
				rejected += req.body.rejected[i]+',';
			rejected += req.body.rejected[req.body.rejected.length -1];

			query.query('SELECT status FROM locality_image WHERE image_id IN ('+rejected+')', [], function(err, results, fields) {
				if(err) {
					logger.info(err);
					res.json({error: "Some error occured"});
				}
				else {
					for(var j = 0; j < results.length; j++) {
						query.query('UPDATE locality_image SET status="rejected" WHERE image_id=?', [req.body.rejected[j]], function(err, results, fields) {
								if(err) {
									logger.info(err);
									res.json({error: "Some error occured"});
								}
							});
						if(results[j].status == "selected")  {
							query.query('SELECT image_location FROM locality_image WHERE image_id=?',[req.body.rejected[j]], function(err, results, fields) {
								if(err) {
									logger.info(err);
									res.json({error: "Some error occured"});
								}
								else {
									var path = (results[0].image_location).split('/');
									fs.unlink('./public'+'/'+path[0]+'/'+'selected'+'/'+path[2]+'/'+path[3]+'/'+path[4]+'/'+path[5]+'/'+path[6],function(err) {
										if(err) {
											logger.info(err);
											res.json({error: "Some error occured"});
										}
									});
								}
							});
						}
					}	
					res.json({status:"done"});			
				}
			});
		}
		else {
			res.json({msg: "no one got rejected"});
		}
	}
	else {
		res.json({status: "logout"});
	}
});

module.exports = router;