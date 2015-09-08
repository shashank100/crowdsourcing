var express = require('express'),
connect = require('../database/dbConnect'),
connection = connect.makeConnection(),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req,res){
	var data = [],j = 0;
	if(req.session && req.session.user && req.session.role == "admin") {
		connection.query('SELECT user_id,locality_id FROM user_selected_locality WHERE status="pendingFromAdmin"', function(err, results, fields){
			if(err) {
				logger.info(err);
				res.json({error: "some error occured"});
			}
			else {
				if(results.length != 0) {
					for(var i in results) {
						connection.query('SELECT firstname,lastname,email,user_id,locality_name,locality_id FROM user_details, locality WHERE user_id = ? AND locality_id = ?',[results[i].user_id,results[i].locality_id], function(err1, results1, fields1){
							if(err1) {
								logger.info(err1);
								res.json({error: "some error occured"});
							}
							else {
								data.push(results1);
								j++;
								if(j == results.length)
									res.json(data);
							}
						});		
					}
				}
				else {
					res.json(data);
				}
			}
		});	
	}
	else {
		res.json({status: 'logout'});
	}
});
module.exports = router;