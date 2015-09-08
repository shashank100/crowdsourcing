var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req, res) {
  if(req.session && req.session.user && req.session.role == "admin") { 
    query.query('select locality_name , locality_city, locality_id from locality where locality_id in (select locality_id from user_selected_locality where user_id = ? and status="approved")',[req.body.userId],
      function(err, results, fields) {
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
  	res.json({status: 'logout'});
  }
});
module.exports = router;