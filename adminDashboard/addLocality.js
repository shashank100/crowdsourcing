var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req,res){
	if(req.session && req.session.user && req.session.role == "admin") {
		query.query('INSERT INTO locality (locality_name,locality_city,status,geocode_polygon_json) VALUES (?,?,?,?)', [req.body.locality_name,req.body.locality_city,'waitingSelection',req.body.polygon], function(err, results, fields) {
			if(err) {
				logger.info(err);
				res.json({error: "Some error occured"});
			}
			else {
				res.json({message: "Locality added Successfully"});
			}
		});
	}
	else {
		res.json({status: "logout"});
	}
});
module.exports = router;