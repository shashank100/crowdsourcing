var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req, res){
	if(req.session && req.session.user && req.session.role == "user"){
		query.query('SELECT geocode_polygon_json FROM locality WHERE locality_id=?',[req.body.locality],function(err,results,fields){
			if(err) {
				logger.info(err);
				res.json({error: "some error occured"});
			}
			else {
				res.json(results);
			}
		});
	}
	else {
		res.json({status: "logout"});
	}
});
module.exports = router;