var express = require('express'),
bcrypt = require('bcryptjs'),
query = require('../database/query'),
salt = bcrypt.genSaltSync(10),
logger = require('../util/logger'),
router = express.Router();

router.post('/',function(req,res) {
  console.log("here");
  query.query('SELECT * FROM user_details WHERE email = ?',[req.body.email],function(err, results, fields){  
    if(err) {
      logger.info(err);
    }
    else {
      if(results.length == 0) {
        var city = req.body.city.toLowerCase();
        query.query('INSERT INTO user_details (firstname,lastname,email,contact,link,status,role,password,city) values (?,?,?,?,?,?,?,?,?)', [req.body.firstname,req.body.lastname,req.body.email,req.body.contact,req.body.link,'approval_pending','user',bcrypt.hashSync("1234", salt),city.toLowerCase()], function(err1, results1){
          if(err1) {
            logger.info(err1);
            res.json({error: ""})
          } 
          else {
            res.json({load:'user_dashboard'});
          }
        });
      }
      else {
        res.json({error:'Email already exists'});
      }
    }
  });
});
module.exports = router;