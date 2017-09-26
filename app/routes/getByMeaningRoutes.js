'use strict';

var express = require('express');
var router = express.Router();

//var Node = require('../../models/node');
//var Function = require('../../models/function');
//var Relation = require('../../models/relation');

router.get('/', function (req, res) {
  res.send('Hello Napo. This is the path to search by meaning. Detailed information can be found <a href=/docs/GETBYMEANING.md>here</a>');
});

router.get('/search', function(req, res) {
  res.send('This is the path to use for searching. Send a POST request with the parameters');
});

router.post('/search', function(req, res) {
  
});


module.exports = router;