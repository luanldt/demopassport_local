// app.js

// require all the modules need
var express = require('express');
var app = new express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database');

// connect to mongoose
mongoose.connect(configDB.url);

require('./config/passport')(passport);

// set MIDDLEWARE
app.use(morgan('dev')); // log moi khi request
app.use(cookieParser()); // doc cookies (can cho auth)
app.use(bodyParser()); // lay thong tin tu html form

app.set('view engine', 'ejs'); // set template

//require for passport
app.use(session({
    secret: 'demopassportluandeptrai'
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login session
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require('./app/routes')(app, passport);// load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('The magic happens on port: ' + port);

