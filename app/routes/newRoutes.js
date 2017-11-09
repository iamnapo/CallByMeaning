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
  Node.findOne({name: name}, (err, node) => {
    if (err) console.error(err);
    if (node) {
      node.units = node.units.concat(units);
      node.markModified('units');
      node.save((err, node) => {
        if (err) console.error(err);
      });
      return res.status(200).send('Node added.');
    } else {
      Node.create({name: name, desc: desc, units: units}, (err, node) => {
        if (err) console.error(err);
        if (node.length !== 0) return res.status(200).send('Node added.');
        return res.status(418).send('Something went wrong.');
      });
    }
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
  Function.findOne({name: name}, (err, func) => {
    if (err) console.error(err);
    if (func) {
      func.argsNames = func.argsNames.concat(argsNames);
      func.argsUnits = func.argsUnits.concat(argsUnits);
      func.returnsNames = func.returnsNames.concat(returnsNames);
      func.returnsUnits = func.returnsUnits.concat(returnsUnits);
      if (codeFile !== './js/default.js') func.codeFile = codeFile;
      func.markModified('argsNames');
      func.markModified('argsUnits');
      func.markModified('returnsNames');
      func.markModified('returnsUnits');
      func.markModified('codeFile');
      func.save((err, node) => {
        if (err) console.error(err);
      });
      res.status(200).send('Function added.');
    } else {
      Function.create({
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
    }
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
  let mathRelation = req.body.mathRelation || 'start';
  let connects = start === '' || end === '' ? [] : [{start: {name: start}, end: {name: end}, mathRelation: mathRelation}];
  Relation.findOne({name: name}, (err, relation) => {
    if (err) console.error(err);
    if (relation) {
      relation.connects = relation.connects.concat(connects);
      relation.markModified('connects');
      relation.save((err, node) => {
        if (err) console.error(err);
      });
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
    fix.fixReferences();
    fix.fixRelations();
  }
  if (req.body.command === 'fixtests') {
    fix.fixTests();
  }
  return res.send('cool bro');
});

router.all('/:anything', (req, res) => {
  return res.status(404).send('Hmm... How did you end up here?');
});

module.exports = router;
