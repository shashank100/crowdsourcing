var express = require('express'),
query = require('../database/query'),
bcrypt = require('bcryptjs'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req,res) {	

	query.query('SELECT * FROM user_details WHERE email=?',[req.body.email],function(err, results, fields){
		if(err) {
			logger.info(err);
			res.json({error:"Error occurred please try again"});
		} 
		else {
			console.log(  results.length );
			if(results.length == 0)
				res.json({error:"Incorret Email or password"});
			else {
				
				if(bcrypt.compareSync(req.body.password,results[0].password) == true) {
					if(results[0].role == 'user') {
						if(results[0].status == "approval_pending") {
							res.json({error: "Yet to be approved by Admin."});
						}
						else if(results[0].status == "rejected") {
							res.json({error: "Your profile has been rejected"});
						}
						else {
							req.session.user = results[0].user_id;
							req.session.email = results[0].email;
							req.session.role = results[0].role;
							res.json({load:"user_dashboard"});	
						}
		
					}
					else {
						req.session.user = results[0].user_id;
						req.session.email = results[0].email;
						req.session.role = results[0].role;
						res.json({load:"admin_dashboard"});
					}
				}
				else {
					res.json({error:"Incorret Email or password"});
				}

			}
		}
		
	});
});
module.exports = router;