var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res){
  if(req.session && req.session.user && req.session.role == "admin")
  {
    query.query('SELECT * FROM user_details WHERE user_id=? and role=?',[req.session.user,req.session.role],function(err, results, fields){
      if(err) {
        logger.info(err);
        res.json({error: "some error occured"});
      }
      else if(results.length == 0) {
        req.session.reset();
        res.json({status: "logout"});
      }
      else if(results[0].role == 'user') {
        req.session.reset();
        res.json({status: "logout"}); 
      }
      query.query('SELECT user_id, firstname, lastname ,email ,link FROM user_details WHERE status = "approval_pending" and role ="user"',function(err1, results1, fields1){
        if(err1) {
          logger.info(err1);
          res.json({error: "some error occured"});
        }
        else {
          res.json(results1);
        }
      });

    });
  }
  else {
    res.json({status: "logout"});
  }
});
module.exports = router;