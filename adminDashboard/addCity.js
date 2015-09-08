var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req,res){
	if(req.session && req.session.user && req.session.role == "admin") {
		query.query('INSERT INTO city (city) VALUES (?)', [req.body.city], function(err, results, fields) {
			if(err) {
				logger.info(err);
				res.json({error: "Some error occured"});
			}
			else {
				res.json({message: "City added Successfully"});
			}
		});
	}
	else {
		res.json({status: "logout"});
	}
});
module.exports = router;