var connect = require('../database/dbConnect'),
connection = connect.makeConnection(),
logger = require('../util/logger');
module.exports =  {
	query : function (queryString, params, callback) {
		connection.query(queryString,params,function(err,results,fields){
			callback(err, results, fields)
		}); 
	}
};