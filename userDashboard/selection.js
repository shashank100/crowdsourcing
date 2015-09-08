var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req,res) {
	if(req.session && req.session.user && req.session.role == "user") {
		query.query('INSERT INTO user_selected_locality (user_id,locality_id,start_date,end_date,status) VALUES (?,?,?,?,?)',
			[req.session.user,req.body.locality,req.body.start_date,req.body.end_date,req.body.status],function(err, results, fields){
				if(err) {
					logger.info(err);
					res.json({error: "Some error occured"});
				}
				else {
					query.query('UPDATE locality SET status=? where locality_id=?',[req.body.locality_status, req.body.locality], function(err, results, fields) {
						if(err) { 
							logger.info(err);
							res.json({error: "Some error occured"});
						}
						else {
							query.query('SELECT loc.locality_name, loc.locality_city, usl.start_date, usl.end_date, usl.status FROM user_selected_locality usl, locality loc WHERE user_id = ? AND usl.locality_id = loc.locality_id',[req.session.user],function(err, results, fields){
								if(err) {
									logger.info(err);
									res.json({error: "some error occured"});
								}
								else if(results.length == 0) {
									res.json({error:"Some error occured"});
								}
								else {
									res.json(results);
								}
							}); 
						}
					});
				}         
			}); 
}
else {
	res.json({error: "logout"});
}
});
module.exports = router;