var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res){
	if(req.session && req.session.user && req.session.role == "user") { 
		query.query('select l.locality_id,l.locality_name from locality l, user_selected_locality us where l.locality_id = us.locality_id AND user_id = ? AND us.status="approved"',[req.session.user],function(err, results, fields){
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