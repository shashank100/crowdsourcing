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

router.delete('/:filePath',function(req, res) {
  var handleResult = function (result, redirect) {
    if (redirect) {
      res.writeHead(302, {
        'Location': redirect.replace(
          /%s/,
          encodeURIComponent(JSON.stringify(result))
          )
      });
      res.end();
    } else {
      res.writeHead(200, {
        'Content-Type': req.headers.accept
        .indexOf('application/json') !== -1 ?
        'application/json' : 'text/plain'
      });
      res.end(JSON.stringify(result));
    }
  }
  var handler = new UploadHandler(req, res, handleResult);
  handler.destroy('raw'+'/'+req.session.city+'/'+req.session.locality+'/'+req.session.email+'/'+req.session.category);
});
module.exports = router;