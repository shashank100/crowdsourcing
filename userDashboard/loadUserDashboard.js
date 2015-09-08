var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.get('/',function(req,res) {
	if(req.session && req.session.user && req.session.role == "user") {
		query.query('SELECT * FROM user_details WHERE user_id=? and role=?',[req.session.user,req.session.role],function(err, results, fields){
			if(err) {
				logger.info(err);
				req.session.reset();
				res.redirect('/index');
			}
			else if(results.length == 0) {
				req.session.reset();
				res.redirect('/index');
			}
			else {
				res.render('user_dashboard.jade');
			}
		}); 
	}
	else {
		req.session.reset();
		res.redirect('/index');
	}
});
module.exports = router;