'use strict';

const shell = require('shelljs');

const Node = require('../models/node');
const Function = require('../models/function');
const Relation = require('../models/relation');

function createFuncJSON() {
  shell.exec('rm -f ./app/dev/funcs.json');
  if (shell.exec('jsdoc ./library -X >> ./app/dev/funcs.json').code !== 0) {
    shell.echo('Error: Could not create .json');
    shell.exit(1);
  } else {
    shell.echo('Success: funcs.json created.');
  }
}

function getFunctions() {
  let allFuncs = require('./funcs.json'); // even those not exported
  let temp = [];
  for (let func of allFuncs) {
    if (func.scope === 'static' && func.memberof === '_' && func.author) {
      temp.push(func);
    }
  }
  return temp;
}

function getFuncProperties(funcs) {
  let temp = [];
  for (let func of funcs) {
    temp.push({
      name: func.longname.slice(2),
      desc: replaceAll(func.description, '\n', ' '),
      codeFile: './js/' + func.meta.filename,
      argsNames: getArgs(func).names,
      argsUnits: getArgs(func).units,
      returnsNames: getReturns(func).names,
      returnsUnits: getReturns(func).units,
    });
  }
  return temp;
}

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

function getArgs(func) {
  let tempName = [];
  let tempUnit = [];
  if (func.params && func.params.length !== 0) {
    for (let param of func.params) {
      tempName.push(param.name);
      tempUnit.push(param.type.names[0]);
    }
  }
  return {names: tempName, units: tempUnit};
}

function getReturns(func) {
  let tempName = [];
  let tempUnit = [];
  if (func.returns && func.returns.length !== 0) {
    for (let returns of func.returns) {
      tempName.push(func.author[0]);
      tempUnit.push(returns.type.names[0]);
    }
  }
  return {names: tempName, units: tempUnit};
}

function addFuncsToDB(funcProperties) {
  for (let func of funcProperties) {
    Function.create({
      name: func.name,
      desc: func.desc,
      codeFile: func.codeFile,
      argsNames: func.argsNames,
      argsUnits: func.argsUnits,
      returnsNames: func.returnsNames,
      returnsUnits: func.returnsUnits,
    }, function(err) {
      if (err) console.error(err);
    });
  }
}

function getParams(funcs) {
  let temp = [];
  for (let func of funcs) {
    if (func.params && func.params.length !== 0) {
      for (let param of func.params) {
        temp.push({
          name: param.name,
          desc: param.description,
        });
      }
    }
    if (func.returns && func.returns.length !== 0) {
      for (let returns of func.returns) {
        temp.push({
          name: func.author[0] || 'return value',
          desc: returns.description,
        });
      }
    }
  }
  let names = new Set();
  temp.forEach(function(param) {
    names.add(param.name);
  });
  let temp2 = temp.filter(function(param) {
    if (names.has(param.name)) {
      names.delete(param.name);
      return true;
    }
    return false;
  });
  return temp2;
}

function addNodesToDB(params) {
  for (let param of params) {
    Node.create({
      name: param.name,
      desc: param.desc,
    }, function(err) {
      if (err) console.error(err);
    });
  }
}

function fixNodeInFuncReferences() {
  Node.find({}, function(err, nodes) {
    if (err) console.log(err);
    Function.find({}, function(err, funcs) {
      if (err) console.log(err);
      for (let func of funcs) {
        for (let node of nodes) {
          if (func.argsNames.indexOf(node.name) > -1) func.args.push(node._id);
          if (func.returnsNames.indexOf(node.name) > -1) func.returns.push(node._id);
        }
        func.save();
      }
    });
  });
}

function fixFuncInNodeReferences() {
  Node.find({}, function(err, nodes) {
    if (err) console.log(err);
    Function.find({}, function(err, funcs) {
      if (err) console.log(err);
      for (let node of nodes) {
        for (let func of funcs) {
          for (let i = 0; i < func.argsNames.length; i++) {
            if (func.argsNames[i] === node.name) {
              node.func_arg.push({id: func._id, name: func.name, unitType: func.argsUnits[i]});
              node.units.push(func.argsUnits[i]);
            }
          }
          for (let i = 0; i < func.returnsNames.length; i++) {
            if (func.returnsNames[i] === node.name) {
              node.func_res.push({id: func._id, name: func.name, unitType: func.returnsUnits[i]});
              node.units.push(func.returnsUnits[i]);
            }
          }
        }
        node.units = [...new Set(node.units)];
        node.markModified('units');
        node.save();
      }
    });
  });
}

function createRelations() {
  Relation.create({
    name: 'requiredBy',
    desc: 'First node is required to define/give meaning to second node.',
  });
  Relation.create({
    name: 'representsA',
    desc: 'First node is a different representation of second node',
  });
  Relation.create({
    name: 'unitConversion',
    desc: 'The two nodes are differents unit of measurement of the same thing.',
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

  Node.create({
    name: 'milliseconds',
    desc: 'Unit of measurement of time.',
    units: ['milliseconds'],
  });

  // 'unitConversion'
  Node.findOne({name: 'hours'}, function(err, nodeA) {
    if (err) console.log(err);
    Node.findOne({name: 'seconds'}, function(err, nodeB) {
      if (err) console.log(err);
      Relation.findOne({name: 'unitConversion'}, function(err, relation) {
        if (err) console.log(err);
        let start = {
          id: nodeA._id,
          name: nodeA.name,
        };
        let end = {
          id: nodeB._id,
          name: nodeB.name,
        };
        relation.connects.push({start: start, end: end, mathRelation: 'start / 60'});
        relation.connects.push({start: end, end: start, mathRelation: 'start * 60'});
        relation.save();
      });
    });
    Node.findOne({name: 'milliseconds'}, function(err, nodeB) {
      if (err) console.log(err);
      Relation.findOne({name: 'unitConversion'}, function(err, relation) {
        if (err) console.log(err);
        let start = {
          id: nodeA._id,
          name: nodeA.name,
        };
        let end = {
          id: nodeB._id,
          name: nodeB.name,
        };
        relation.connects.push({start: start, end: end, mathRelation: 'start / 3600000'});
        relation.connects.push({start: end, end: start, mathRelation: 'start * 3600000'});
        relation.save();
      });
    });
  });
}

function fixRelations() {
  Node.find({}, function(err, nodes) {
    if (err) console.error(err);
    Relation.findOne({name: 'unitConversion'}, (err, relation) => {
      if (err) console.error(err);
      for (let connection of relation.connects) {
        for (let node of nodes) {
          if (connection.start.name.indexOf(node.name) > -1) connection.start.id = (node._id);
          if (connection.end.name.indexOf(node.name) > -1) connection.end.id = (node._id);
        }
      }
      relation.markModified('connects');
      relation.save();
    });
  });
}

function fillWithFuncs() {
  let funcs = getFunctions();
  let funcProperties = getFuncProperties(funcs);
  let params = getParams(funcs);
  let funcsTorun = [
    () => createFuncJSON(),
    () => addFuncsToDB(funcProperties),
    () => addNodesToDB(params),
    () => fixNodeInFuncReferences(),
    () => fixFuncInNodeReferences(),
    () => createRelations(),
    () => fixRelations(),
    () => console.log('DONE!'),
  ];
  funcsTorun.forEach((func) => func());
}

module.exports =
{
  'fillWithFuncs': fillWithFuncs,
  'fixNodeInFuncReferences': fixNodeInFuncReferences,
  'fixFuncInNodeReferences': fixFuncInNodeReferences,
  'fixRelations': fixRelations,
};