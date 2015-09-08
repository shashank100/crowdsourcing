var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req,res){
	if(req.session && req.session.user && req.session.role == "user") {
		query.query('SELECT * FROM user_selected_locality WHERE user_id = ? AND locality_id = ?',[req.session.user,req.body.localityId],function(err, results, fields){
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