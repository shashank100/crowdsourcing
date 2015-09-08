var fstream = require('fstream'), 
fs = require('fs'),
express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req,res){
	if(req.session && req.session.user && req.session.role == "admin") {
		query.query('SELECT image_location FROM locality_image WHERE image_id=?', [req.body.image_id], function(err, results, fields) {
			if(err) {
				logger.info(err);
				res.json({error: "Some error occured"});
			}
			else {
				var info = (results[0].image_location).split('/');
				var src = './public/'+info[0]+'/'+info[1]+'/'+info[2]+'/'+info[3]+'/'+info[4]+'/'+info[5]+'/'+info[6];
				var dest = './public/'+info[0]+'/'+info[1]+'/'+info[2]+'/'+info[3]+'/'+info[4]+'/'+req.body.category+'/'+info[6];
				var srcThumb = './public/'+info[0]+'/'+info[1]+'/'+info[2]+'/'+info[3]+'/'+info[4]+'/'+info[5]+'/thumbnail/'+info[6];
				var destThumb = './public/'+info[0]+'/'+info[1]+'/'+info[2]+'/'+info[3]+'/'+info[4]+'/'+req.body.category+'/thumbnail/'+info[6]
				fs.readFile(srcThumb, function(err, data) {
					if(err) {
						logger.info(err);
						logger.info("Some error occured");
					}
					else {
						fs.writeFile(destThumb, data,function(err) {
							if(err) {
								logger.info(err);
								logger.info("Some error occured");
							}
							else {
								fs.unlink(srcThumb, function(err) {
									if(err) {
										logger.info(err);
										logger.info("Some error occured");
									}
									else {
										fs.readFile(src, function(err, data) {
											if(err) {
												logger.info(err);
												logger.info("Some error occured");
											}
											else {
												fs.writeFile(dest, data,function(err) {
													if(err) {
														logger.info(err);
														logger.info("Some error occured");
													}
													else {
														fs.unlink(src, function(err) {
															if(err) {
																logger.info(err);
																res.json({error: "Some error occured"});
															}
															else {
																query.query('UPDATE locality_image SET category="'+req.body.category+'", image_location="'+info[0]+'/'+info[1]+'/'+info[2]+'/'+info[3]+'/'+info[4]+'/'+req.body.category+'/'+info[6]+'" WHERE image_id=?', [req.body.image_id], function(err, results, fields) {
																	if(err) {
																		logger.info(err);
																		res.json({error: "Some error occured"});
																	}
																	else {
																		res.json({image_id:req.body.image_id});
																	}
																});
															}
														});	
													}
												});
											}	
										});
									}
								});
							}
						}); 
					}
				});
			}
		});	
	}
	else {
		res.json({status: "logout"});
	}
});
module.exports = router;