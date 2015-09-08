var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
makeDir = require('./makeDir');
router = express.Router();

router.post('/', function(req, res){
	if(req.session && req.session.user && req.session.role == "admin") {
		query.query('UPDATE user_selected_locality SET status="approved" WHERE user_id=? AND locality_id=?',[req.body.user_id,req.body.locality_id],function(err, results, fields){
			if(err) {
				logger.info(err);
				res.json({error: "Some error occured"});
			}
			else {
				query.query('UPDATE locality SET status="approved" WHERE locality_id=?',[req.body.locality_id], function(err, results, fields){
					if(err) {
						logger.info(err);
						res.json({error: "Some error occured"});
					}
					else {
						query.query('SELECT u.email, l.locality_city, l.locality_name FROM user_details u, locality l WHERE u.user_id=? and l.locality_id=?',[req.body.user_id,req.body.locality_id] ,function(err1, results1, fields1){
							if(err1) {
								logger.info(err1);
								res.json({error: "Some error occured"});
							}
							else {
								for (var i in results1) {
									var localityNameDir = './public/files';
									makeDir.makeDirectoryStructure(localityNameDir+'/'+'raw'+'/'+results1[0].locality_city+'/'+results1[i].locality_name,results1[0].email,0);
									makeDir.makeDirectoryStructure(localityNameDir+'/'+'selected'+'/'+results1[0].locality_city+'/'+results1[i].locality_name,results1[0].email,1);
								}
								res.json({message:'User Locality approved'});
							}	
						});
					}
				});	
			}
		});
}
else {
	res.json({status: 'logout'});
}
});
module.exports = router;