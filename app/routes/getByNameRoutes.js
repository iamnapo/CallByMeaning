'use strict';

var express = require('express');
var router = express.Router();

var Node = require('../../models/node');
var Function = require('../../models/function');
var Relation = require('../../models/relation');

router.get('/', function (req, res) {
  res.send('Hello Napo. This is the path to search by name. Detailed information can be found <a href=../docs/GETBYNAME.md>here</a>.<br> Check <a href=./gbn/c>/c/</a><br>Check <a href=./gbn/f>/f/</a><br>Check <a href=./gbn/r>/r/</a>');
});

router.get('/c', function (req,res) {
  res.send('This is the path to search for concepts e.g "time"');
});

router.get('/c/:node', function(req, res) {
  Node.findOne({name: req.params.node}, function (err, node) {
    if (err) {
      console.log(err);
    } else {
      if (!node) {
        return res.status(418).send('Node not found in DB.');
      } else {
        return res.json(node);        
      }
    }
  });
});

router.get('/f', function(req, res) {
  res.send('This is the path to search for functions e.g "getZodiac"');
});

router.get('/f/:func', function(req, res) {
  Function.findOne({name: req.params.func}).populate('args').populate('results').exec(function (err, func) {
    if (err) {
      console.log(err);
    } else {
      if (!func) {
        res.status(418).send('Function not found in DB');
      } else {
        res.json(func);
      }
    }
  });
});

router.get('/r', function(req, res) {
  res.send('This is the path to search for relations e.g "requiredBy"');
});

router.get('/r/:rel', function(req, res) {
  Relation.findOne({name: req.params.rel}, function (err, rel) {
    if (err) {
      console.log(err);
    } else {
      if (!rel) {
        res.status(418).send('Relation not found in DB');
      } else {
        res.json(rel);
      }
    }
  });
});

module.exports = router;