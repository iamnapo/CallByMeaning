var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var morgan = require('morgan');
var port = process.env.PORT || 3000;

var Node = require('./models/node');
// var indexRoutes = require('./routes/index');

mongoose.connect('mongodb://admin:admin@ds149724.mlab.com:49724/callbymeaning', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(morgan('dev'));


// app.use(function (req, res, next) {
//   res.locals.currentUser = req.user;
//   res.locals.error = req.flash('error');
//   res.locals.success = req.flash('success');
//   next();
// });

// app.use('/', indexRoutes);


var server = app.listen(port, function () {
  console.log('Server has started at port %s!', server.address().port);
});