'use strict';

var express = require('express');
var router = express.Router();
var WordPOS = require('wordpos');
var wordpos = new WordPOS();

var Node = require('../models/node');
var Function = require('../models/function');
var Relation = require('../models/relation');

router.get('/', function (req, res) {
  return res.send('Hello. This is the path to search by name. Detailed information can be found <a href=https://github.com/iamnapo/CallByMeaning/>here</a>.<br> Check <a href=./gbn/c>/c/</a><br>Check <a href=./gbn/f>/f/</a><br>Check <a href=./gbn/r>/r/</a>');
});

router.get('/c', function (req,res) {
  return res.send('This is the path to search for concepts e.g "time"');
});

router.get('/c/:node', function(req, res) {
  let name = req.params.node;
  Node.findOne({name: name}, function (err1, node1) {
    if (err1) console.log(err1);
    if (node1) return res.json(node1);
    wordpos.lookup(name.replace('_', ' '), function (result) {
      let checked = 0;
      if (result[0] == null) return res.status(418).send('Node not found in DB.');
      for (node1 of result[0].synonyms) {
        if (res.headersSent) break;
        Node.findOne({name: node1.replace(/[^\w\d\s]/g, '')}, function (err, node2) {
          checked += 1;
          if (err) console.log(err);
          if (node2) return res.json(node2);
          if (checked === result[0].synonyms.length && !res.headersSent) return res.status(418).send('Node not found in DB.');
        });
      }
    });
  });
});

router.get('/f', function(req, res) {
  return res.send('This is the path to search for functions e.g "getZodiac"');
});

router.get('/f/:func', function(req, res) {
  Function.findOne({name: req.params.func}).populate('args').populate('results').exec(function (err, func) {
    if (err) console.log(err);
    if (!func) return res.status(418).send('Function not found in DB');
    return res.json(func);
  });
});

router.get('/r', function(req, res) {
  return res.send('This is the path to search for relations e.g "requiredBy"');
});

router.get('/r/:rel', function(req, res) {
  Relation.findOne({name: req.params.rel}, function (err, rel) {
    if (err) console.log(err);
    if (!rel) return res.status(418).send('Relation not found in DB');
    return res.json(rel);
  });
});

router.all('/:anything', function (req, res) {
  return res.status(404).send('Hmm... How did you end up here?');
});

module.exports = router;