var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res){
	if(req.session && req.session.user && req.session.role == "user") { 
		query.query('SELECT locality_city,locality_name FROM locality WHERE locality_id = ?',[req.body.locality],function(err, results, fields){
			if(err) {
				logger.info(err);
				res.json({error: "some error occured"});
			}
			else {
				req.session.city = results[0].locality_city;
				req.session.locality = results[0].locality_name;
				req.session.category = req.body.locCategory;
				res.send({status:"ok"}); 
			}
		});
	}
	else {
		res.json({status: "logout"});
	}
});
module.exports = router;