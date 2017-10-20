'use strict';

require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var port = process.env.PORT || 3000;

mongoose.connect(process.env.ON_HEROKU == 1 ? 'mongodb://admin:' + process.env.MLAB_PASS + '@ds149724.mlab.com:49724/callbymeaning' : 'mongodb://localhost/callbymeaning', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/js', express.static(__dirname + '/../library'));
app.use('/docs', express.static(__dirname + '/../docs'));
var accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), {flags: 'a'});
app.use(morgan('dev', {stream: accessLogStream}));

app.get('/', function (req, res) {
  res.send('<h1>Hello There :)</h1><br>Check <a href=./gbn>Get by name</a><br>Check <a href=./gbm>Get by meaning</a><br>Check <a href=./cbm>Call by meaning</a>');
});

var getByName = require('./routes/getByNameRoutes');
app.use('/gbn', getByName);

var getByMeaning = require('./routes/getByMeaningRoutes');
app.use('/gbm', getByMeaning);

var callByMeaning = require('./routes/callByMeaningRoutes');
app.use('/cbm', callByMeaning);

app.all('/:anything', function (req, res) {
  res.status(404).send('Hmm... How did you end up here?');
});

var server = app.listen(port, function () {
  console.log('Server has started at http://localhost:%s. ' + chalk.magenta('Have fun :)'), port);
});

exports.close = function(){
  mongoose.connection.close();
  server.close();
};