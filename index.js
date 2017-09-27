'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var morgan = require('morgan');
var chalk = require('chalk');

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
app.use('/js', express.static(__dirname + '/library'));
app.use('/docs', express.static(__dirname + '/app/docs'));
app.use(morgan('dev'));

// var seedDB = require('./app/seedDB'); seedDB();

var getByName = require('./app/routes/getByNameRoutes');
app.use('/', getByName);

var getByMeaning = require('./app/routes/getByMeaningRoutes');
app.use('/gbm', getByMeaning);

var server = app.listen(port, function () {
  console.log('Server has started at http://localhost:%s. ' + chalk.magenta('Have fun :)'), server.address().port);
});