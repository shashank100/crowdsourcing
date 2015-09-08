var express = require('express'),
fs = require('fs'),
path = require('path'),
_existsSync = fs.existsSync || path.existsSync,
nodeStatic = require('node-static'),
options = require('./imgConfig.js'),
formidable = require('formidable'),
imageMagick = require('imagemagick'),
router = express.Router();
eval(fs.readFileSync('imgUtil.js')+'');
router.get('/',function(req, res) {
	if(req.session && req.session.user) {
		res.setHeader(
			'Access-Control-Allow-Origin',
			options.accessControl.allowOrigin
			);
		res.setHeader(
			'Access-Control-Allow-Methods',
			options.accessControl.allowMethods
			);
		res.setHeader(
			'Access-Control-Allow-Headers',
			options.accessControl.allowHeaders
			);
		var handleResult = function (result, redirect) {
			if (redirect) {
				res.writeHead(302, {
					'Location': redirect.replace(
						/%s/,
						encodeURIComponent(JSON.stringify(result))
						)
				});
				res.end();
			} 
			else {
				res.writeHead(200, {
					'Content-Type': req.headers.accept
					.indexOf('application/json') !== -1 ?
					'application/json' : 'text/plain'
				});
				res.end(JSON.stringify(result));
			}
		},
		setNoCacheHeaders = function() {
			res.setHeader('Pragma', 'no-cache');
			res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
			res.setHeader('Content-Disposition', 'inline; filename="files.json"');
		};
		var handler = new UploadHandler(req, res, handleResult);
		setNoCacheHeaders();
		console.log(req.session.city);
		handler.get('raw'+'/'+req.session.city+'/'+req.session.locality+'/'+req.session.email+'/'+req.session.category);
	}
	else {
		res.redirect('/index');
	}
});
module.exports = router;