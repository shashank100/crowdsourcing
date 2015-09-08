var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res) {
	if(req.session && req.session.user && req.session.role == "admin") {
		query.query('select locality_id, locality_name from locality where status="approved"', function(err, results, fields){
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