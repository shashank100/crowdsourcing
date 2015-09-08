var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
      cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {
        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
          cluster.fork();
        });

// Code to run if we're in a worker process

} 
else {
  var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  winston = require('winston'),
  assert = require('assert'),
  session = require('client-sessions'),
  sendgrid = require('sendgrid')('dealsmart', 'dealsmart@123'),
  email = new sendgrid.Email(),
  app = express(),
  query = require('./database/query'),
  register = require('./auth/register'),
  userDashboard = require('./userDashboard/loadUserDashboard'),
  adminDashboard = require('./adminDashboard/loadAdminDashboard'),
  remove = require('./imgDelete.js'),
  upload = require('./imgUpload.js'),
  enquire = require('./userDashboard/enquire'),
  selection = require('./userDashboard/selection'),
  selectedLocality = require('./userDashboard/selectedLocality'),
  checkSelectedLocality = require('./userDashboard/checkSelectedLocality')
  profiles = require('./adminDashboard/profiles'),
  status = require('./adminDashboard/status'),
  worksubmitted = require('./adminDashboard/workSubmitted'),
  getLocalityOfApprovedUsers = require('./adminDashboard/getLocalityOfApprovedUsers'),
  findUsersSelectedLocality = require('./userDashboard/findUsersSelectedLocality'),
  getWork = require('./adminDashboard/getWork'),
  uploadImagesInSelectedFolder = require('./userDashboard/uploadImagesInSelectedFolder'),
  getPolygon = require('./userDashboard/getPolygon'),
  approveLocality = require('./adminDashboard/approveLocality'),
  approveSelectedLocality = require('./adminDashboard/approveSelectedLocality'),
  rejectSelectedLocality = require('./adminDashboard/rejectSelectedLocality'),
  index = require('./index.js'),
  get = require('./imgGet.js'),
  login = require('./auth/login'),
  changePwd = require('./auth/changePwd'),
  rejectVerdict = require('./adminDashboard/rejectVerdict'),
  selectVerdict = require('./adminDashboard/selectVerdict'),
  compress = require('./compress.js'),
  addLocality = require('./adminDashboard/addLocality'),
  getCity = require('./adminDashboard/getCity'),
  addCity = require('./adminDashboard/addCity'),
  getCityUser = require('./userDashboard/getCityUser'),
  changeCategory = require('./adminDashboard/changeCategory'),
  getFTPLocality = require('./adminDashboard/getFTPLocality');

  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(session({
    cookieName:'session',
    secret:'sdafljhl435kjh534jl1kh43513245j4531jk345',
    duration: 60*1000*43829,
    cookie: {
      maxAge: null,
      ephemeral: true,
      httpOnly: true,
      secure: false
    }
  }));
  app.use(function(req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });

  app.use('/',index);
  app.use('/index',index);
  app.use('/changePwd',changePwd);
  app.use('/login',login);
  app.use('/register',register);
  app.use('/user_dashboard',userDashboard);
  app.use('/admin_dashboard',adminDashboard);
  app.use('/imgUpload',upload);
  app.use('/files',remove);
  app.use('/enquire',enquire);
  app.use('/selection',selection);
  app.use('/selected_locality',selectedLocality);
  app.use('/chkSelectedLocality',checkSelectedLocality);
  app.use('/status', status);
  app.use('/profiles',profiles);
  app.use('/worksubmitted', worksubmitted);
  app.use('/getLocalityofApprovedUsers', getLocalityOfApprovedUsers);
  app.use('/getwork', getWork);
  app.use('/findUsersSelectedLocality', findUsersSelectedLocality);
  app.use('/uploadImagesInSelectedFolder', uploadImagesInSelectedFolder);
  app.use('/getPolygon', getPolygon);
  app.use('/approveLocality', approveLocality);
  app.use('/approveSelectedLocality', approveSelectedLocality);
  app.use('/rejectSelectedLocality', rejectSelectedLocality);
  app.use('/imgUpload', get);
  app.use('/selectVerdict', selectVerdict);
  app.use('/rejectVerdict',rejectVerdict);
  app.use('/getFTPLocality',getFTPLocality);
  app.use('/addLocality', addLocality);
  app.use('/getCity', getCity);
  app.use('/addCity', addCity);
  app.use('/compress', compress); 
  app.use('/changeCategory',changeCategory);
  app.use('/getCityUser', getCityUser);
  app.get('/logout',function(req,res) {
    if(req.session) {
      req.session.reset();
    }
    res.redirect('index');
  });

  console.log('running..');
  app.set('port', process.env.PORT || 3000);
  app.listen(app.get('port'));

// email.addTo("manish.singh@commonfloor.com");
// email.setFrom("freelance@commonfloor.com");
// email.setSubject("Sending with SendGrid is Fun");
// email.setHtml("and easy to do anywhere, even with Node.js");
// sendgrid.send(email);


/*Time of login clear error when something is typed again*/
}