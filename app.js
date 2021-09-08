require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var indexRouter = require('./routes/index');
var confirmRouter = require('./routes/confirm');

// LD Demo: Import the Launch Darkly SDK 
var LaunchDarkly = require('launchdarkly-node-server-sdk');
var ldClient = LaunchDarkly.init(process.env.LAUNCH_DARKLY_SDK_KEY);

// LD Demo: Set an example user context
var user = {
  "key": "test-02",
  "name": "Jane Doe",
  "custom": {
    "loggedin": true
  }
}

// LD Demo: Track conversion events in Launch Darkly.
// We wrap the SDK's track method so any router can call it without managing user state
function trackLDEvent(key,params) {
  ldClient.track(key,user,params);
  ldClient.flush();
}

// LD Demo: Get the state of all feature flags on each request, before passing to the router
// This acts as a middleware function in Expresss
function getLDFlags(req,res,next){
  ldClient.waitForInitialization().then(function() {
    //console.log('LD Initialized');
    ldClient.allFlagsState(user,function(err, flagState){
      res.locals.flags = flagState.toJSON(); // convert flags to JSON, make available to routers
      res.locals.ldTracker = trackLDEvent;  // make our track method wrappre available to routers
      next();
    });    
  });
};


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// LD Demo: set getLDFlags as middleware
app.use('/', getLDFlags, indexRouter);
app.use('/confirm', getLDFlags, confirmRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;