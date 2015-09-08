var fstream = require('fstream'), 
fs = require('fs'),
query = require('./database/query'),
rmdir = require('rimraf'),
express = require('express'),
logger = require('./util/logger'),
router = express.Router(),
tar = require('tar'),
zlib = require('zlib'),
Client = require('ftp');
connectionProperties = {
	host: "192.168.0.35",
	user: "ashutosh",
	password: "maxheap123"
},
c = new Client();



router.post('/', function(req, res) {
	if(req.session && req.session.user && req.session.role == "admin") {

		var city  = (req.body.city).substr(0,1).toUpperCase()+(req.body.city).substr(1);
		fstream.Reader({ 'path': './public/files/raw/'+req.body.city+'/'+req.body.locality, 'type': 'Directory' }) 
		.pipe(tar.Pack()) 
		.pipe(zlib.Gzip())
		.pipe(fstream.Writer({ 'path': './temp/raw/'+req.body.locality+'.tar.gz' }).on('close', function() {
			var check = './SneakPeek/Raw/Photos/'+city+'/';
			var local = './temp/raw/'+req.body.locality+'.tar.gz';
			var remote = './SneakPeek/Raw/Photos/'+city+'/'+req.body.locality+'.tar.gz';
			var remove  = './public/files/raw/'+req.body.city+'/'+req.body.locality;
			c.connect(connectionProperties);
			c.on('ready', function() {
				c.cwd(check, function(err) {
					if(err) {
						c.mkdir(check,true,function(err) {
							if(err) console.log(err);
							else {
								c.put(local, remote, function(err) {
									
									fs.unlink(local ,function(err) {
										if(err) console.log(err);
									});

									rmdir(remove, function(err) {
										if(err) console.log(err);
									});

									query.query('UPDATE locality SET status="completed" WHERE locality_name=? AND locality_city=?', [req.body.locality, req.body.city], function(err, results, fields) {
										if(err) logger.info(err);
									});

									query.query('UPDATE user_selected_locality SET status="completed" WHERE locality_id=(SELECT locality_id FROM locality WHERE locality_name=? AND locality_city=?)', [req.body.locality, req.body.city], function(err, results, fields) {
										if(err) logger.info(err);
									});

									c.end();
								});
							}
						});
					}
					else {
						c.put(local, remote, function(err) {

							fs.unlink(local ,function(err) {
								if(err) console.log(err);
							});

							rmdir(remove, function(err) {
								if(err) console.log(err);
							});

							query.query('UPDATE locality SET status="completed" WHERE locality_name=? AND locality_city=?', [req.body.locality, req.body.city], function(err, results, fields) {
								if(err) logger.info(err);
							});

							query.query('UPDATE user_selected_locality SET status="completed" WHERE locality_id=(SELECT locality_id FROM locality WHERE locality_name=? AND locality_city=?)', [req.body.locality, req.body.city], function(err, results, fields) {
								if(err) logger.info(err);
							});

							c.end();
						});
					}
				});
			});
		}));


		fstream.Reader({ 'path': './public/files/selected/'+req.body.city+'/'+req.body.locality, 'type': 'Directory' })
		.pipe(tar.Pack())
		.pipe(zlib.Gzip())
		.pipe(fstream.Writer({ 'path': './temp/selected/'+req.body.locality+'.tar.gz' }).on('close', function() {		
			c.connect(connectionProperties);
			var check = './SneakPeek/Selected/'+city+'/';
			var local = './temp/selected/'+req.body.locality+'.tar.gz';
			var remote = './SneakPeek/Selected/'+city+'/'+req.body.locality+'.tar.gz';
			var remove  = './public/files/selected/'+req.body.city+'/'+req.body.locality;
			c.on('ready', function() {
				c.cwd(check, function(err) {
					if(err) {
						c.mkdir(check,true,function(err) {
							if(err) console.log(err);
							else {
								c.put(local, remote, function(err) {
									fs.unlink(local ,function(err) {
										if(err) console.log(err);
									});

									rmdir(remove, function(err) {
										if(err) console.log(err);
									});

									c.end();
								});
							}
						});
					}
					else {
						c.put(local, remote, function(err) {
							
							fs.unlink(local ,function(err) {
								if(err) console.log(err);
							});

							rmdir(remove, function(err) {
								if(err) console.log(err);
							});

							c.end();
						});
					}
				});
				
			});
		}));

res.json({compress:"done"});
}
else {
	res.json({status: "logout"});
}
});

module.exports = router;

function Deploy(local, remote, callback) {
	c.connect(connectionProperties);
	c.on('ready', function() {
		c.put(local, remote, function(err) {
			callback(err);
			c.end();
		});
	});
}
