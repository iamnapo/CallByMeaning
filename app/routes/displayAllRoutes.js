'use strict';

var express = require('express');
var router = express.Router();

var Node = require('../models/node');
var Function = require('../models/function');
var Relation = require('../models/relation');

router.get('/', function (req, res) {
  return res.send('Hello.<br> Check <a href=./all/nodes>nodes</a><br>Check <a href=./all/functions>functions</a><br>Check <a href=./all/relations>relations</a>');
});

router.get('/nodes', function(req, res) {
  Node.find({}, function (err, nodes) {
    if (err) console.log(err);
    if (nodes.length === 0) return res.status(418).send('There aren\'t any nodes.');
    let temp = [];
    for (let node of nodes) {
      temp.push(
        {
          name: node.name,
          description: node.desc,
          units: node.units
        }
      );
    }
    return res.json(temp);
  });
});

router.get('/functions', function(req, res) {
  Function.find({}, function (err, funcs) {
    if (err) console.log(err);
    if (funcs.length === 0) return res.status(418).send('There aren\'t any functions.');
    let temp = [];
    for (let func of funcs) {
      temp.push(
        {
          name: func.name,
          description: func.desc,
          source_code: func.codeFile
        }
      );
    }
    return res.json(temp);
  });
});

router.get('/relations', function(req, res) {
  Relation.find({}, function (err, relations) {
    if (err) console.log(err);
    if (relations.length === 0) return res.status(418).send('There aren\'t any relations.');
    let temp = [];
    for (let relation of relations) {
      temp.push(
        {
          name: relation.name,
          description: relation.desc
        }
      );
    }
    return res.json(temp);
  });
});

router.all('/:anything', function (req, res) {
  return res.status(404).send('Hmm... How did you end up here?');
});

module.exports = router;