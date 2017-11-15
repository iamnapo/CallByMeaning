'use strict';

const express = require('express');
const router = new express.Router();

const Node = require('../models/node');
const Function = require('../models/function');
const Relation = require('../models/relation');

router.get('/', (req, res) => {
  return res.send('Hello.<br> Check <a href=./all/nodes>nodes</a><br>Check <a href=./all/functions>functions</a><br>Check <a href=./all/relations>relations</a>');
});

router.get('/nodes', (req, res) => {
  Node.find({}, (err, nodes) => {
    if (err) console.error(err);
    if (nodes.length === 0) return res.status(418).send('There aren\'t any nodes.');
    let temp = [];
    for (let node of nodes) {
      temp.push(
        {
          name: node.name,
          description: node.desc,
          units: node.units,
        }
      );
    }
    return res.json(temp);
  });
});

router.get('/nodes/names', (req, res) => {
  Node.find({}, (err, nodes) => {
    if (err) console.error(err);
    if (nodes.length === 0) return res.status(418).send('There aren\'t any nodes.');
    let temp = [];
    for (let node of nodes) {
      temp.push(node.name);
    }
    return res.json(temp);
  });
});

router.get('/functions', (req, res) => {
  Function.find({}, (err, funcs) => {
    if (err) console.error(err);
    if (funcs.length === 0) return res.status(418).send('There aren\'t any functions.');
    let temp = [];
    for (let func of funcs) {
      temp.push(
        {
          name: func.name,
          description: func.desc,
          source_code: func.codeFile,
        }
      );
    }
    return res.json(temp);
  });
});

router.get('/functions/names', (req, res) => {
  Function.find({}, (err, funcs) => {
    if (err) console.error(err);
    if (funcs.length === 0) return res.status(418).send('There aren\'t any functions.');
    let temp = [];
    for (let func of funcs) {
      temp.push(func.name);
    }
    return res.json(temp);
  });
});

router.get('/functions/descriptions', (req, res) => {
  Function.find({}, (err, funcs) => {
    if (err) console.error(err);
    if (funcs.length === 0) return res.status(418).send('There aren\'t any functions.');
    let temp = [];
    for (let func of funcs) {
      temp.push(func.desc);
    }
    return res.json(temp);
  });
});

router.get('/relations', (req, res) => {
  Relation.find({}, (err, relations) => {
    if (err) console.error(err);
    if (relations.length === 0) return res.status(418).send('There aren\'t any relations.');
    let temp = [];
    for (let relation of relations) {
      temp.push(
        {
          name: relation.name,
          description: relation.desc,
        }
      );
    }
    return res.json(temp);
  });
});

module.exports = router;