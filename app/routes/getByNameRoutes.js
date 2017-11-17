'use strict';

const express = require('express');
const router = new express.Router();
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

const Node = require('../models/node');
const Function = require('../models/function');
const Relation = require('../models/relation');

router.get('/', (req, res) => {
  return res.send('Hello. This is the path to search by name. Detailed information can be found <a href=https://github.com/iamnapo/CallByMeaning/>here</a>.<br> Check <a href=./gbn/c>/c/</a><br>Check <a href=./gbn/f>/f/</a><br>Check <a href=./gbn/r>/r/</a>');
});

router.get('/c', (req, res) => {
  return res.send('This is the path to search for concepts e.g "time"');
});

router.get('/c/:node', (req, res) => {
  let name = req.params.node;
  Node.findOne({name: name}, (err1, node1) => {
    if (err1) console.error(err1);
    if (node1) return res.json(node1);
    wordpos.lookup(name.replace('_', ' '), (result) => {
      let checked = 0;
      if (result[0] == null) return res.status(418).send('Node not found in DB.');
      for (node1 of result[0].synonyms) {
        if (res.headersSent) break;
        Node.findOne({name: node1.replace(/[^\w\d\s]/g, '')}, (err, node2) => {
          checked += 1;
          if (err) console.error(err);
          if (node2) return res.json(node2);
          if (checked === result[0].synonyms.length && !res.headersSent) return res.status(418).send('Node not found in DB.');
        });
      }
    });
  });
});

router.get('/f', (req, res) => {
  return res.send('This is the path to search for functions e.g "getZodiac"');
});

router.get('/f/:func', (req, res) => {
  Function.findOne({name: req.params.func}).populate('args').populate('results').exec((err, func) => {
    if (err) console.error(err);
    if (func) return res.json(func);
    return res.status(418).send('Function not found in DB');
  });
});

router.get('/r', (req, res) => {
  return res.send('This is the path to search for relations e.g "requiredBy"');
});

router.get('/r/:rel', (req, res) => {
  Relation.findOne({name: req.params.rel}, (err, rel) => {
    if (err) console.error(err);
    if (rel) return res.json(rel);
    return res.status(418).send('Relation not found in DB');
  });
});

module.exports = router;