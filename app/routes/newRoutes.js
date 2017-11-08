'use strict';

const express = require('express');
const router = new express.Router();

const Node = require('../models/node');
const Function = require('../models/function');
const Relation = require('../models/relation');

const fix = require('../dev/fillWithFuncs');

router.all('/', (req, res) => {
  return res.send('Hello. From this path you can add new thing to the DB by sending a POST request to /node, /function or /relation.');
});

router.post('/node', (req, res) => {
  let name = req.body.name;
  let desc = req.body.desc || '';
  let units = req.body.units || [];
  units = units instanceof Object ? units : units.split(' ').join('').split(',');

  Node.create(
    {
      name: name,
      desc: desc,
      units: units,
    }, (err, node) => {
      if (err) console.error(err);
      if (node.length !== 0) return res.status(200).send('Node added.');
      return res.status(418).send('Something went wrong.');
    });
});

router.all('/node/:anything', (req, res) => {
  return res.status(404).send('Hmm... How did you end up here?');
});

router.post('/function', (req, res) => {
  let name = req.body.name;
  let desc = req.body.desc || '';
  let argsNames = req.body.argsNames || [];
  argsNames = argsNames instanceof Object ? argsNames : argsNames.split(' ').join('').split(',');
  let argsUnits = req.body.argsUnits || [];
  argsUnits = argsUnits instanceof Object ? argsUnits : argsUnits.split(' ').join('').split(',');
  let returnsNames = req.body.returnsNames || [];
  returnsNames = returnsNames instanceof Object ? returnsNames : returnsNames.split(' ').join('').split(',');
  let returnsUnits = req.body.returnsUnits || [];
  returnsUnits = returnsUnits instanceof Object ? returnsUnits : returnsUnits.split(' ').join('').split(',');
  let codeFile = req.body.codeFile || './js/default.js';
  Function.create(
    {
      name: name,
      desc: desc,
      argsNames: argsNames,
      argsUnits: argsUnits,
      returnsNames: returnsNames,
      returnsUnits: returnsUnits,
      codeFile: codeFile,
    }, (err, func) => {
      if (err) console.error(err);
      if (func.length !== 0) return res.status(200).send('Function added.');
      return res.status(418).send('Something went wrong.');
    });
});

router.all('/function/:anything', (req, res) => {
  return res.status(404).send('Hmm... How did you end up here?');
});

router.post('/relation', (req, res) => {
  let name = req.body.name;
  let desc = req.body.desc || '';
  let start = req.body.start || '';
  let end = req.body.end || '';
  let connects = [];
  connects.push({start: {name: start}, end: {name: end}});
  let mathRelation = req.body.mathRelation || 'start';
  Relation.findOne({name: name}, (err, relation) => {
    if (err) console.error(err);
    if (relation.length !== 0) {
      relation.connects.push({start: {name: start}, end: {name: end}, mathRelation: mathRelation});
      relation.save();
      return res.status(200).send('Relation added.');
    } else {
      Relation.create(
        {
          name: name,
          desc: desc,
          connects: connects,
          mathRelation: mathRelation,
        }, (err, relation) => {
          if (err) console.error(err);
          if (relation.length !== 0) return res.status(200).send('Relation added.');
          return res.status(418).send('Something went wrong.');
        }
      );
    }
  });
});

router.all('/relation/:anything', (req, res) => {
  return res.status(404).send('Hmm... How did you end up here?');
});

router.post('/fix', (req, res) => {
  if (req.body.command === 'fixit') {
    fix.fixNodeInFuncReferences();
    fix.fixFuncInNodeReferences();
    fix.fixRelations();
  }
  return res.send('cool bro');
});

router.all('/:anything', (req, res) => {
  return res.status(404).send('Hmm... How did you end up here?');
});

module.exports = router;
