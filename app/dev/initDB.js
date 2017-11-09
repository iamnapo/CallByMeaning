'use strict';

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/callbymeaning';

// This scripts creates a new db with everything from the default one. mongod MUST be already running before used.
MongoClient.connect(url, (err, db) => {
  if (err) console.error(err);
  let mongoCommand = {copydb: 1, fromhost: 'localhost', fromdb: 'callbymeaning', todb: process.env.DB};
  let admin = db.admin();
  admin.command(mongoCommand, (commandErr, data) => {
    if (!commandErr) {
      console.log(data);
    } else {
      console.log(commandErr.errmsg);
    }
    db.close();
  });
});