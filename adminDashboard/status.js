var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/', function(req, res) {
  if(req.session && req.session.user && req.session.role == "admin") {
    query.query('SELECT * FROM user_details WHERE user_id = ? and role=?',[req.session.user,req.session.role],function(err, results, fields){
      if(err) {
        logger.info(err);
        res.json({error: "some error occured"});
      }
      else if(results.length == 0) {
        res.json({status: "logout"});
      }
      else if(results[0].role == 'user') {
        res.json({status: "logout"}); 
      }
      else if(req.body.status == 1) {
        query.query('UPDATE user_details SET status="approved" WHERE user_id=?',[req.body.user_id],function(err1, results1, fields1){
          if(err1) {
           logger.info(err1);
           res.json({error: "some error occured"});
          }
          else {
            res.json({message:"User has been approved"});
          }
       });
      }
      else if(req.body.status == 0) {
        query.query('UPDATE user_details SET status="rejected" WHERE user_id = ?',[req.body.user_id],function(err1, results1, fields1){
          if(err1) {
            logger.info(err1);
            res.json({error: "some error occured"});
          }
          else {
            res.json({message:"User has been rejected"});
          }
        });
      }
      else if(req.body.status == 2) {
        query.query('SELECT * FROM user_details where status="approval_pending"',function(err1, results1, fields1){
          if(err1) {
            logger.info(err1);
            res.json({error: "some error occured"});
          }
          else {
            res.json(results1.length);
          }
        });
      }
    });
  }
  else {
    res.json({status: "logout"});
  }
});
module.exports = router;