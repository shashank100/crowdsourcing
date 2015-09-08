var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res) {
	if(req.session && req.session.user && req.session.role == "user") {
		query.query('SELECT locality_id FROM  user_selected_locality WHERE user_id=?', [req.session.user], function(err, results, fields) {
			if(err) {
				logger.info(err);
				res.json({error:"Some error occured"});
			}
			else if(results.length == 0) {
				query.query('SELECT city FROM city', function(err, results, fields){
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
				console.log(results[0].locality_id);
				query.query('SELECT locality_city AS city FROM locality WHERE locality_id=?', [results[0].locality_id], function(err, results, fields) {
					if(err) {
						logger.info(err);
						res.json({error: "some error occured"});
					}
					else {
						res.json(results);
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