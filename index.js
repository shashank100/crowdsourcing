var express = require('express'),
logger = require('./util/logger'),
query = require('./database/query'),
router = express.Router();

router.get('/',function(req, res){
	if(req.session && req.session.user && req.session.role == "user") {
		query.query('SELECT user_id FROM user_details WHERE user_id=? and role=?',[req.session.user,req.session.role], function(err, results, fields){
			if(err) {
				logger.info(err);
				res.redirect('/logout');
			}
			else {
				res.redirect('/user_dashboard');
			}
		});

	}
	else if(req.session && req.session.user && req.session.role == "admin") {
		query.query('SELECT user_id FROM user_details WHERE user_id=? and role=?',[req.session.user,req.session.role], function(err, results, fields){
			if(err) {
				logger.info(err);
				res.redirect('/logout');
			}
			else {
				res.redirect('/admin_dashboard');
			}
		});
	}
	else {
		res.render('index.jade');
	}
});

module.exports = router;