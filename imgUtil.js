var logger = require('./util/logger'), 
query = require('./database/query'),
im = require('imagemagick');

FileInfo = function (file) {
  this.name = getName()+ (file.name).substr((file.name).indexOf('.'),(file.name).length);;
  this.size = file.size;
  this.type = file.type;
  this.deleteType = 'DELETE';
  console.log(this.name);
},
fileServer = new nodeStatic.Server(options.publicDir, options.nodeStatic),
utf8encode = function (str) {
  return unescape(encodeURIComponent(str));
},
nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
nameCountFunc = function (s, index, ext) {
  return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
},
UploadHandler = function (req, res, callback) {
  this.req = req;
  this.res = res;
  this.callback = callback;
};

fileServer.respond = function (pathname, status, _headers, files, stat, req, res, finish) {
// Prevent browsers from MIME-sniffing the content-type:
_headers['X-Content-Type-Options'] = 'nosniff';
if (!options.inlineFileTypes.test(files[0])) {
    // Force a download dialog for unsafe file extensions:
    _headers['Content-Type'] = 'application/octet-stream';
    _headers['Content-Disposition'] = 'attachment; filename="' +
    utf8encode(path.basename(files[0])) + '"';
  }
  nodeStatic.Server.prototype.respond
  .call(this, pathname, status, _headers, files, stat, req, res, finish);
};
FileInfo.prototype.validate = function () {
  if (options.minFileSize && options.minFileSize > this.size) {
    this.error = 'File is too small';
  } else if (options.maxFileSize && options.maxFileSize < this.size) {
    this.error = 'File is too big';
  } else if (!options.acceptFileTypes.test(this.name)) {
    this.error = 'Filetype not allowed';
  }
  return !this.error;
};
FileInfo.prototype.safeName = function () {
  // Prevent directory traversal and creating hidden system files:
  this.name = path.basename(this.name).replace(/^\.+/, '');
  // Prevent overwriting existing files:
  while (_existsSync(options.uploadDir + '/' + this.name)) {
    this.name = this.name.replace(nameCountRegexp, nameCountFunc);
  }
};
FileInfo.prototype.initUrls = function (req,user) {
  if (!this.error) {
    var that = this,
    baseUrl = (options.ssl ? 'https:' : 'http:') +
    '//' + req.headers.host + options.uploadUrl;
    this.url = this.deleteUrl = baseUrl + encodeURIComponent(this.name);
    Object.keys(options.imageVersions).forEach(function (version) {
      if (_existsSync(
        options.uploadDir + '/' + user + '/' + version + '/' + that.name
        )) {
        that[version + 'Url'] = baseUrl + '/' + user + '/' + version + '/' +
      encodeURIComponent(that.name);
    }
  });
  }
};
UploadHandler.prototype.get = function (user) {
  var handler = this,
  files = [];
  fs.readdir(options.uploadDir+'/'+user, function (err, list) {
    var index = list.indexOf('thumbnail');
    var temp = "";
    if(index > -1) {
      list.splice(index,1);
    }
    if(list.length > 1) {
      for(var i = 0; i < list.length; i++)
        if(i!= list.length-1)
          temp += '"files/'+user + '/' + list[i]+'",';
        else
          temp +='"files/'+user + '/' + list[i]+'"';
        query.query('SELECT image_name FROM locality_image WHERE image_location IN ('+temp+') AND status="uploaded"', [],function(err, results, fields){
          if(err)
            logger.info(err)
          else {
            for(var j = 0; j< results.length;j++) {
              var name = results[j].image_name;
              var stats = fs.statSync(options.uploadDir + '/' + user + '/' + name),
              fileInfo;
              if (stats.isFile() && name[0] !== '.') {
                fileInfo = new FileInfo({
                  name: name,
                  size: stats.size
                });
                fileInfo.initUrls(handler.req,user);
                files.push(fileInfo);
              }
            }
          }
          handler.callback({files: files});
        });
      }
      else {
       handler.callback({files: files});
     }
   }); 
};
UploadHandler.prototype.post = function (user,locality,user_id, category, city) {
  var handler = this,
  form = new formidable.IncomingForm(),
  tmpFiles = [],
  files = [],
  map = {},
  counter = 1,
  redirect,
  finished = function () {
    counter -= 1;
    if (!counter) {
      files.forEach(function (fileInfo) {
        im.identify('./public/files/'+user+'/'+fileInfo.name, function (err, features){
          if (err) { return console.error(err.stack || err);}
        });
        fileInfo.initUrls(handler.req,user);
      });
      handler.callback({files: files}, redirect);
    }
  },
  finish = function () {
    counter -= 1;
    if (!counter) {
      files.forEach(function (fileInfo) {
        im.identify('./public/files/'+user+'/'+fileInfo.name, function (err, features){
          if (err) { return console.error(err.stack || err);}
          else {
           query.query('SELECT locality_id FROM locality WHERE locality_name=?',[locality],function(err, results, fields){
            if(err) {
              logger.info(err);
            }
            else {
              query.query('INSERT INTO locality_image (image_name,image_location,locality_id,user_id,status,geocode_lat,geocode_lng,image_file_size_in_mb,image_width_px,image_height_px,category,city) values (?,?,?,?,?,?,?,?,?,?,?,?)',[fileInfo.name,'files/'+user+'/'+fileInfo.name,results[0].locality_id,user_id,'uploaded',features.properties['exif:gpslatitude'],features.properties['exif:gpslongitude'],fileInfo.size/(1000*1000),features.width,features.height,category,city],function(err, results, fields){
                if(err) {
                  logger.info(err);
                }
              });
            }
          });
         }
       });
        fileInfo.initUrls(handler.req,user);
      });
handler.callback({files: files}, redirect);
}
};
form.uploadDir = options.tmpDir;
form.on('fileBegin', function (name, file) {
  tmpFiles.push(file.path);
  var fileInfo = new FileInfo(file);
  fileInfo.safeName();
  map[path.basename(file.path)] = fileInfo;
  files.push(fileInfo);
}).on('field', function (name, value) {
  if (name === 'redirect') {
    redirect = value;
  }
}).on('file', function (name, file) {
  var fileInfo = map[path.basename(file.path)];
  fileInfo.size = file.size;
  if (!fileInfo.validate()) {
    fs.unlink(file.path);
    return;
  }
  fs.renameSync(file.path, options.uploadDir + '/' + user + '/' + fileInfo.name);
  if (options.imageTypes.test(fileInfo.name)) {
    Object.keys(options.imageVersions).forEach(function (version) {
      counter += 1;
      var opts = options.imageVersions[version];
      im.resize({
        width: opts.width,
        height: opts.height,
        srcPath: options.uploadDir + '/' + user + '/' + fileInfo.name,
        dstPath: options.uploadDir + '/' + user + '/' + version + '/' +
        fileInfo.name
      }, finish);
    });
  }
}).on('aborted', function () {
  tmpFiles.forEach(function (file) {
    fs.unlink(file);
  });
}).on('error', function (e) {
  logger.info(e);
}).on('progress', function (bytesReceived) {
  if (bytesReceived > options.maxPostSize) {
    handler.req.query.destroy();
  }
}).on('end', finished).parse(handler.req);
};
UploadHandler.prototype.destroy = function (user) {
  var handler = this,
  fileName;
  fileName = handler.req.params.filePath;
  if (fileName) {
    fs.unlink(options.uploadDir + '/' + user + '/' + fileName, function (ex) {
      Object.keys(options.imageVersions).forEach(function (version) {
        fs.unlink(options.uploadDir + '/' + user + '/' + version + '/' + fileName,function(err2){
          if(err2){
            logger.info(err2)
          }
        });
      });
      if(!ex) {
        query.query('DELETE FROM locality_image WHERE image_location=?', ['files' + '/' + user + '/' + fileName],function(err, results, fields){
          if(err)
            logger.info(err);
        });
      }
      handler.callback({success: !ex});
    });

    return;
  }
};

function getName() {
  var currentdate = new Date();

    var datetime = currentdate.getDate().toString()
    + (currentdate.getMonth()+1).toString()
    + currentdate.getFullYear().toString()
    + currentdate.getHours().toString()
    + currentdate.getMinutes().toString()
    + currentdate.getSeconds().toString()
    + currentdate.getMilliseconds().toString();
    return datetime;
}