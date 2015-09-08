var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res) {
	if(req.session && req.session.user && req.session.role == "admin") {
		query.query('UPDATE user_selected_locality SET status="rejected" WHERE user_id=? AND locality_id=?',[req.body.user_id, req.body.locality_id], function(err, results, fields){
			if(err) {
				logger.info(err);
				res.json({error: "Some error occured"});
			}
			else {
				query.query('UPDATE locality SET status="waitingSelection" where locality_id=?', [req.body.locality_id], function(err, results, fields) {
					if(err) {
						logger.info(err);
						res.json({error: "Some error occured"});
					}
					else {
						res.json({status:"locality rejected"});
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