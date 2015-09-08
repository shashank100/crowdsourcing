var express = require('express'),
query = require('../database/query'),
logger = require('../util/logger'),
router = express.Router();
router.post('/',function(req,res) {
  if(req.session && req.session.user && req.session.role == "user") {

    if(req.body.status == 0) { //status = 0 is for checking if user has not selected a locality; Coming from user_dashboard.js
      query.query('SELECT * FROM user_selected_locality WHERE user_id=?',[req.session.user],function(err, results, fields){
        if(err) {
          logger.info(err);
          res.json({error: "some error occured"});
        }
        else if(results.length == 0) {
          res.json({status:"0"});  // status = 0 response means not selected 
        }
        else {
          query.query('SELECT * FROM user_selected_locality WHERE user_id= ? AND status="approved"',[req.session.user],function(err1, results1, fields1){
            if(err1){
              logger.info(err1);
              res.json({error: "some error occured"});
            }
            else if(results1.length == 0)
              res.json({status:"1"}); // status = 1 response means yet to be approved
            else
              res.json({status:"2"}); // status = 2 response means selected and approved
          }); 
        }
      });
    }
    else if(req.body.status == 1) { //status = 1 is for selecting list of localities for population dropdown; Coming from dashboard.js
      query.query('SELECT locality_id,locality_name FROM locality WHERE locality_city=? AND status="waitingSelection"',[req.body.city],function(err, results, fields){
        if(err) {
          logger.info(err);
          res.json({error: "some error occured"});
        }
        else {
          res.json({list : results});
        }
      }); 
    }
    else if(req.body.status == 2) {
      query.query('SELECT l.locality_id, l.locality_name FROM locality l,user_selected_locality us WHERE us.locality_id=l.locality_id AND us.user_id=?',[req.session.user],function(err,results,fields){
        if(err) {
          logger.info(err);
          res.json({error: "some error occured"});
        }
        else {
          res.json({list: results});
        }
      });
    }
  }
  else {
    res.json({status: "logout"});
  }
});
module.exports = router;