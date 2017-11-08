'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.ON_HEROKU == 1 ? 'mongodb://admin:' + process.env.MLAB_PASS + '@ds149724.mlab.com:49724/callbymeaning' : 'mongodb://localhost:27017/'.concat(process.env.DB || 'callbymeaning'), {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/js', express.static(__dirname + '/../library'));
app.use('/internal', express.static(__dirname + '/../library/internal'));
app.use('/docs', express.static(__dirname + '/../docs'));
let accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), {flags: 'a'});
app.use(morgan('dev', {stream: accessLogStream}));

app.get('/', (req, res) => {
  return res.send('<h1>Hello There :)</h1><br>Check <a href=./gbn>Get by name</a><br>Check <a href=./gbm>Get by meaning</a><br>Check <a href=./cbm>Call by meaning</a>');
});

let addNew = require('./routes/newRoutes');
app.use('/new', addNew);

let displayAll = require('./routes/displayAllRoutes');
app.use('/all', displayAll);

let getByName = require('./routes/getByNameRoutes');
app.use('/gbn', getByName);

let getByMeaning = require('./routes/getByMeaningRoutes');
app.use('/gbm', getByMeaning);

let callByMeaning = require('./routes/callByMeaningRoutes');
app.use('/cbm', callByMeaning);

app.all('/:anything', (req, res) => {
  res.status(404).send('Hmm... How did you end up here?');
});

let server = app.listen(port, () => {
  if (process.env.ON_HEROKU == 0) {
    console.log('mongodb://localhost:27017/'.concat(process.env.DB || 'callbymeaning'));
    console.log('Server ' + chalk.green('started') + ' at http://localhost:%s. Have fun. 😀', port);
  } else {
    console.log('Server ' + chalk.green('started') + '. Have fun. 😀');
  }
});

exports.close = () => {
  mongoose.connection.close();
  server.close();
};
