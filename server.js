// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');

var configDB = require('./api/config/database.js');
var configPassport = require('./api/config/passport');

// configuration
configDB.initDB(false); // Change the boolean to remove the database data

// Token Handler
passport.use(configPassport.tokenHandler());

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(passport.initialize());

// routes
require('./api/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Launch
app.listen(port);
console.log('Server listening on localhost:' + port);