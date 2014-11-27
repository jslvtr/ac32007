// get all the tools we need
var express             = require('express');
var app                 = express();
var port                = process.env.PORT || 8080;
var passport            = require('passport');
var flash               = require('connect-flash');
var bodyParser          = require('body-parser');
var FacebookStrategy    = require('passport-facebook');

// Socket.io
var http                = require('http').Server(app);
var Server              = require('socket.io');
var io                  = new Server(http);

io.serveClient(false);

var morgan       = require('morgan');

var configDB = require('./api/config/database');
var configAuth = require('./api/config/auth');
var configPassport = require('./api/config/passport');

// configuration
configDB.initDB(false); // Change the boolean to remove the database data

// Token Handler
passport.use(configPassport.tokenHandler());
passport.use(new FacebookStrategy(configAuth.facebook, configPassport.facebookHandler));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(passport.initialize());
app.set('views', __dirname + '/app');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer); // for parsing multipart/form-data

// Cors headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

// routes
require('./api/routes.js')(app, io, passport); // load our routes and pass in our app and fully configured passport



// Launch
//app.listen(port);
//console.log('Server listening on localhost: ' + port);

http.listen(port, function () {
    console.log('Server listening on localhost: ' + port);
});