module.exports = function(){
	var express  = require('express');
	var app      = express();
	var port     = process.env.PORT || 80;
	var mongoose = require('mongoose');
	var passport = require('passport');
	var flash    = require('connect-flash');
	var winston  = require('winston');

	var morgan       = require('morgan');
	var cookieParser = require('cookie-parser');
	var bodyParser   = require('body-parser');
	var session      = require('express-session');

	var configDB = require('./config/database.js');

	/* Connect to the database */
	mongoose.connect(configDB.url);

	require('./config/passport')(passport);

	//app.use(morgan('dev')); // log every request to the console
	app.use(cookieParser()); // read cookies (needed for auth)
	app.use(bodyParser.json()); // get information from html forms

	var sessionConfig = require('./config/sessionConfig.js');
	app.use(session({
		secret: sessionConfig.secretKey,
		resave: false,
		saveUninitialized: false
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.use(express.static('./bower_components'));
	app.use(express.static('./static'));

	/* Include the routes */
	require('./app/routes.js')(app, passport);

	app.get('*', function(req, res){
		res.sendFile(__dirname + '/static/index.html');
	});

	/* Start listening on port */
	app.listen(port);
};

