

var express = require('express'),
bcrypt = require('bcryptjs'),
salt = bcrypt.genSaltSync(10),
connect = require('../database/dbConnect'),
connection = connect.makeConnection(),
logger = require('../util/logger'),
router = express.Router();

router.post('/',function(req,res) {

  //console.log(req.session.user);
  // connection.query('SELECT password FROM user_details WHERE user_id = ?',[req.session.user],function(err, results, fields){  
  //   if(err) {
  //     logger.info(err);
  //   }
  //   else{
  //   	if( bcrypt.compareSync(req.body.oPwd,results[0].password ) ){
  //   		//console.log("same password");

  console.log(JSON.stringify(req.body)+"-----"+req.session.user);

    connection.query('UPDATE user_details set password = ? WHERE user_id = ?',[bcrypt.hashSync(req.body.newPwd, salt),req.session.user],function(err1, results1, fields){
    		  if(err1) {
                 console.log("error");
    		      logger.info(err1);
    		    }
    		    else{
                    console.log("success");
    		    	res.json({status:"Changed Pwd Successfully."});
    		    }
    });


  //   	}else{
  //   			res.json({error:"Previousd Password is not Correct."});
  //   	}
      
  //   }
  // });
});

module.exports = router;

