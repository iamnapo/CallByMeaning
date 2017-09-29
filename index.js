'use strict';

require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var chalk = require('chalk');

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://admin:admin@ds149724.mlab.com:49724/callbymeaning', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/js', express.static(__dirname + '/library'));
app.use('/docs', express.static(__dirname + '/app/docs'));
app.use(morgan('dev'));

//var seedDB = require('./app/seedDB'); seedDB();

app.get('/', function (req, res) {
  res.send('<h1>Hello There :)</h1><br>Check <a href=./gbn>Get by name</a><br>Check <a href=./gbm>Get by meaning</a><br>Check <a href=./cbm>Call by meaning</a>');
});

var getByName = require('./app/routes/getByNameRoutes');
app.use('/gbn', getByName);

var getByMeaning = require('./app/routes/getByMeaningRoutes');
app.use('/gbm', getByMeaning);

var callByMeaning = require('./app/routes/callByMeaningRoutes');
app.use('/cbm', callByMeaning);

app.listen(port, host, function () {
  console.log('Server has started at http://%s:%s. ' + chalk.magenta('Have fun :)'), host, port);
});