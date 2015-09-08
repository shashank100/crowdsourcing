var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req, res){
  if(req.session && req.session.user && req.session.role == "admin") {
    query.query('SELECT * FROM user_details WHERE user_id = ? and role=?',[req.session.user,req.session.role],function(err, results, fields){
      if(err) {
        logger.info(err);
        res.json({error: "some error occured"});
      }
      else if(results.length == 0) {
        req.session.reset();
        res.json({status: "logout"});
      }
    });
    query.query('SELECT user_id, firstname,lastname,email FROM user_details where status="approved"',
      function(err1, results1, fields1){
        if(err1){
          logger.info(err1)
          res.json({error: "Some error occured"});
        }else{
          res.json(results1);
        }
      });
  }
  else {
    req.session.reset();
    res.json({status: "logout"});
  }
});
module.exports = router;