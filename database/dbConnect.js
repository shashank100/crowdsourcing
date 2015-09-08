module.exports = {
	makeConnection : function() {
		var mysql = require('mysql'),
	    connection = mysql.createConnection({
	      host : 'localhost',
	      user : 'root',
	      //password : 'crowdsourcing@123', //for production
	      password : '', //for local and stagin
	      database: 'crowdsourcing'
	    });

	    return connection;
	}
};