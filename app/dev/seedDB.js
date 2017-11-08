
// *****THIS FILE IS NOT MEANT TO EVER RUN*****

'use strict';

const Node = require('./models/Node');
const Function = require('./models/Function');
const Relation = require('./models/Relation');

function clearDB() {
  Node.remove({}, (err) => {
    if (err) console.error(err);
  });
  Function.remove({}, (err) => {
    if (err) console.error(err);
  });
  Relation.remove({}, (err) => {
    if (err) console.error(err);
  });
  console.log('DB cleared.');
}

function addNodes() {
  Node.create({
    name: 'time',
    desc: 'A specified time instance e.g 10 seconds.',
    units: ['days', 'hours', 'minutes', 'seconds'],
  });

  Node.create({
    name: 'date',
    desc: 'A specified date.',
    units: ['date'],
  });

  Node.create({
    name: 'zodiac',
    desc: 'A person\'s astrogical sign.',
    units: ['word'],
  });

  Node.create({
    name: 'hours',
    desc: 'Unit of measurement of time.',
    units: ['hours'],
  });

  Node.create({
    name: 'seconds',
    desc: 'Unit of measurement of time.',
    units: ['seconds'],
  });
  console.log('Nodes added.');
}

function addFunctions() {
  Function.create({
    name: 'getTime',
    desc: 'This function returns the current time in seconds since 01/01/1970',
    codeFile: 'getTime.js',
    returnsUnits: ['seconds'],
  });

  Function.create({
    name: 'toTime',
    desc: 'This function takes a date and returns the time in seconds from 01/01/1970 to that date.',
    codeFile: 'toTime.js',
    argsUnits: ['date'],
    returnsUnits: ['seconds'],
  });

  Function.create({
    name: 'getZodiac',
    desc: 'This function takes a person\'s birthday and returns their astrological sign base on that day.',
    codeFile: 'getZodiac.js',
    argsUnits: ['date'],
    returnsUnits: ['word'],
  });
  console.log('Functions added.');
}

function addRelations() {
  Relation.create({
    name: 'requiredBy',
    desc: 'First node is required to define/give meaning to second node.',
  });

  Relation.create({
    name: 'representsA',
    desc: 'First node is a different representation of second node',
  });
  console.log('Relations added.');

  Relation.create({
    name: 'unitConversion',
    desc: 'The two nodes are differents unit of measurement of the same thing.',
  });
}

function fixNodes() {
  // 'time' node
  Function.findOne({name: 'getTime'}, (err, func) => {
    if (err) console.error(err);
    Node.findOne({name: 'time'}, (err, node) => {
      if (err) console.error(err);
      node.func_res.push({id: func._id, name: func.name, unitType: 'seconds'});
      node.save();
    });
  });
  Function.findOne({name: 'toTime'}, (err, func) => {
    if (err) console.error(err);
    Node.findOne({name: 'time'}, (err, node) => {
      if (err) console.error(err);
      node.func_res.push({id: func._id, name: func.name, unitType: 'seconds'});
      node.save();
    });
  });

  // 'date' node
  Function.findOne({name: 'toTime'}, (err, func) => {
    if (err) console.error(err);
    Node.findOne({name: 'date'}, (err, node) => {
      if (err) console.error(err);
      node.func_arg.push({id: func._id, name: func.name, unitType: 'date'});
      node.save();
    });
  });
  Function.findOne({name: 'getZodiac'}, (err, func) => {
    if (err) console.error(err);
    Node.findOne({name: 'date'}, (err, node) => {
      if (err) console.error(err);
      node.func_arg.push({id: func._id, name: func.name, unitType: 'date'});
      node.save();
    });
  });

  // 'zodiac' node
  Function.findOne({name: 'getZodiac'}, (err, func) => {
    if (err) console.error(err);
    Node.findOne({name: 'zodiac'}, (err, node) => {
      if (err) console.error(err);
      node.func_res.push({id: func._id, name: func.name, unitType: 'word'});
      node.save();
    });
  });
  console.log('Nodes fixed.');
}

function fixFunctions() {
  // 'getTime'
  Node.findOne({name: 'time'}, (err, node) => {
    if (err) console.error(err);
    Function.findOne({name: 'getTime'}, (err, func) => {
      if (err) console.error(err);
      func.returns.push(node._id);
      func.returnsNames.push(node.name);
      func.save();
      func.returnsNames = func.returnsNames.sort();
      func.save();
    });
  });

  // 'toTime
  Node.findOne({name: 'time'}, (err, node) => {
    if (err) console.error(err);
    Function.findOne({name: 'toTime'}, (err, func) => {
      if (err) console.error(err);
      func.returns.push(node._id);
      let temp = func.returnsNames;
      temp.push(node.name);
      temp.sort();
      func.returnsNames = temp;
      func.save();
    });
  });
  Node.findOne({name: 'date'}, (err, node) => {
    if (err) console.error(err);
    Function.findOne({name: 'toTime'}, (err, func) => {
      if (err) console.error(err);
      func.args.push(node._id);
      let temp = func.argsNames;
      temp.push(node.name);
      temp.sort();
      func.argsNames = temp;
      func.save();
    });
  });

  // 'getZodiac'
  Node.findOne({name: 'date'}, (err, node) => {
    if (err) console.error(err);
    Function.findOne({name: 'getZodiac'}, (err, func) => {
      if (err) console.error(err);
      func.args.push(node._id);
      let temp = func.argsNames;
      temp.push(node.name);
      temp.sort();
      func.argsNames = temp;
      func.save();
    });
  });
  Node.findOne({name: 'zodiac'}, (err, node) => {
    if (err) console.error(err);
    Function.findOne({name: 'getZodiac'}, (err, func) => {
      if (err) console.error(err);
      func.returns.push(node._id);
      let temp = func.returnsNames;
      temp.push(node.name);
      temp.sort();
      func.returnsNames = temp;
      func.save();
    });
  });
  console.log('Functions fixed.');
}


function fixRelations() {
  // 'requiredBy'
  Node.findOne({name: 'date'}, (err, nodeA) => {
    if (err) console.error(err);
    Node.findOne({name: 'zodiac'}, (err, nodeB) => {
      if (err) console.error(err);
      Relation.findOne({name: 'requiredBy'}, (err, relation) => {
        if (err) console.error(err);
        let start = {
          id: nodeA._id,
          name: nodeA.name,
        };
        let end = {
          id: nodeB._id,
          name: nodeB.name,
        };
        relation.connects.push({start: start, end: end, mathRelation: ''});
        relation.save();
      });
    });
  });

  // 'representsA'
  Node.findOne({name: 'date'}, (err, nodeA) => {
    if (err) console.error(err);
    Node.findOne({name: 'time'}, (err, nodeB) => {
      if (err) console.error(err);
      Relation.findOne({name: 'representsA'}, (err, relation) => {
        if (err) console.error(err);
        let start = {
          id: nodeA._id,
          name: nodeA.name,
        };
        let end = {
          id: nodeB._id,
          name: nodeB.name,
        };
        relation.connects.push({start: start, end: end, mathRelation: ''});
        relation.save();
      });
    });
  });

  // 'unitConversion'
  Node.findOne({name: 'hours'}, (err, nodeA) => {
    if (err) console.error(err);
    Node.findOne({name: 'seconds'}, (err, nodeB) => {
      if (err) console.error(err);
      Relation.findOne({name: 'unitConversion'}, (err, relation) => {
        if (err) console.error(err);
        let start = {
          id: nodeA._id,
          name: nodeA.name,
        };
        let end = {
          id: nodeB._id,
          name: nodeB.name,
        };
        relation.connects.push({start: start, end: end, mathRelation: 'start / 60'});
        relation.save();
      });
    });
  });

  Node.findOne({name: 'seconds'}, (err, nodeA) => {
    if (err) console.error(err);
    Node.findOne({name: 'hours'}, (err, nodeB) => {
      if (err) console.error(err);
      Relation.findOne({name: 'unitConversion'}, (err, relation) => {
        if (err) console.error(err);
        let start = {
          id: nodeA._id,
          name: nodeA.name,
        };
        let end = {
          id: nodeB._id,
          name: nodeB.name,
        };
        relation.connects.push({start: start, end: end, mathRelation: 'start * 60'});
        relation.save();
      });
    });
  });
  console.log('Relations fixed.');
}

function seedDB() {
  // DELETE EVERYTHING
  clearDB();
  // First add some Nodes
  addNodes();
  // Then add some functions
  addFunctions();
  // Then some relations
  addRelations();
  // Then fix node properties
  fixNodes();
  // Then fix function properties
  fixFunctions();
  // Lastly fix relation properties
  fixRelations();

  console.log('DB seeded.');
}

module.exports = seedDB;