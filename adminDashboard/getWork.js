var express = require('express'),
fs = require('fs'),
query = require('../database/query'),
logger = require('../util/logger'),
fs = require('fs'),
router = express.Router();
router.post('/', function(req, res) {
  if(req.session && req.session.user && req.session.role == "admin") { 
     query.query('SELECT * FROM user_details WHERE user_id=?',[req.body.userId],function(err, results, fields){
      if(err) {
        logger.info(err);
        res.json({error:"some error occured"});
      }
      else {

          query.query('SELECT image_name,image_location,image_id FROM locality_image WHERE user_id=? AND category =? AND locality_id=? AND city=? AND status=?',
            [req.body.userId,req.body.category,req.body.locality_id,req.body.city,req.body.imageStatus],function(err1, results1, fields){
                  if(err) {
                    logger.info(err);
                    res.json({error:"some error occured"});
                  }
                  else {
                    if(results1.length>0){
                        res.json(results1);
                    }else{
                        if(results1.length == 0 && req.body.imageStatus == 'uploaded'){
                            res.json({error:'Either no pic has been uploaded or you have already processed the ones for this category.'});
                        }else{
                            var a = results1.length == 0 && req.body.imageStatus == 'selected' ;
                            var b = results1.length == 0 && req.body.imageStatus == 'rejected' ; 
                            if(a || b){
                                  res.json({error:'No '+req.body.imageStatus+' Images Found'});
                            }else{
                                res.json({error:'No Images Found'});
                            }
                            
                        } 
                      
                    }
                  }
          });
      }
    });
  }
  else {
    req.session.reset();
    res.json({status: "logout"});
  }
});

module.exports = router;