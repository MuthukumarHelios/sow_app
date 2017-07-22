var express = require('express'),
      controller = require('./controller.js'),
      morgan = require('morgan'),
      multer = require('multer')(),
      app = express(),
      path = require('path'),
      bodyparser = require('body-parser').json();
      app.use(bodyparser);
app.use(morgan('dev'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
  // res.json("hey")
  res.sendFile(path.join(__dirname + "/views/muthu.html"));
});

app.use(controller);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
   err.status = 500;
   res.json({"server error":err.message})
});
module.exports = app;
