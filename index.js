var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var morgan = require('morgan');

var port = process.env.PORT || 3000;

mongoose.connect('mongodb://admin:admin@ds149724.mlab.com:49724/callbymeaning', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

var server = app.listen(port, function () {
  console.log('Server has started at port %s!', server.address().port);
});