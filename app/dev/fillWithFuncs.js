const shell = require('shelljs');

const Node = require('../models/node');
const Function = require('../models/function');
const Relation = require('../models/relation');

async function createFuncJSON() {
  shell.exec('rm -f ./app/dev/funcs.json');
  if (shell.exec('jsdoc ./library -X >> ./app/dev/funcs.json').code !== 0) {
    shell.echo('Error: Could not create .json');
    shell.exit(1);
  } else {
    shell.echo('Success: funcs.json created.');
  }
}

function getFunctions() {
  // eslint-disable-next-line global-require
  const allFuncs = require('./funcs.json'); // even those not exported
  const temp = [];
  allFuncs.forEach((func) => {
    if (func.scope === 'static' && func.memberof === '_' && func.author) {
      temp.push(func);
    }
  });
  return temp;
}

function replaceAll(target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

function getArgs(func) {
  const tempName = [];
  const tempUnit = [];
  if (func.params && func.params.length !== 0) {
    func.params.forEach((param) => {
      tempName.push(param.name);
      tempUnit.push(param.type.names[0]);
    });
  }
  return {
    names: tempName,
    units: tempUnit,
  };
}

function getReturns(func) {
  const tempName = [];
  const tempUnit = [];
  if (func.returns && func.returns.length !== 0) {
    func.returns.forEach((returns) => {
      tempName.push(func.author[0]);
      tempUnit.push(returns.type.names[0]);
    });
  }
  return {
    names: tempName,
    units: tempUnit,
  };
}

function getFuncProperties(funcs) {
  const temp = [];
  funcs.forEach((func) => {
    temp.push({
      name: func.longname.slice(2),
      desc: replaceAll(func.description, '\n', ' '),
      codeFile: './js/'.concat(func.meta.filename),
      argsNames: getArgs(func).names,
      argsUnits: getArgs(func).units,
      returnsNames: getReturns(func).names,
      returnsUnits: getReturns(func).units,
    });
  });
  return temp;
}

async function addFuncsToDB(funcProperties) {
  funcProperties.forEach((func) => {
    Function.create({
      name: func.name,
      desc: func.desc,
      codeFile: func.codeFile,
      argsNames: func.argsNames,
      argsUnits: func.argsUnits,
      returnsNames: func.returnsNames,
      returnsUnits: func.returnsUnits,
    }, (err) => {
      if (err) console.error(err);
    });
  });
}

function getParams(funcs) {
  const temp = [];
  funcs.forEach((func) => {
    if (func.params && func.params.length !== 0) {
      func.params.forEach((param) => {
        temp.push({
          name: param.name,
          desc: param.description,
        });
      });
    }
    if (func.returns && func.returns.length !== 0) {
      func.returns.forEach((returns) => {
        temp.push({
          name: func.author[0] || 'return value',
          desc: returns.description,
        });
      });
    }
  });
  const names = new Set();
  temp.forEach(param => names.add(param.name));
  const temp2 = temp.filter((param) => {
    if (names.has(param.name)) {
      names.delete(param.name);
      return true;
    }
    return false;
  });
  return temp2;
}

async function addNodesToDB(params) {
  params.forEach((param) => {
    Node.create({
      name: param.name,
      desc: param.desc,
    }, (err) => {
      if (err) console.error(err);
    });
  });
}

function fixFuncInNodeReferences() {
  Node.find({}, (err, nodes) => {
    if (err) console.log(err);
    Function.find({}, (err2, funcs) => {
      if (err2) console.log(err2);
      nodes.forEach((node) => {
        funcs.forEach((func) => {
          for (let i = 0; i < func.argsNames.length; i += 1) {
            if (func.argsNames[i] === node.name) {
              node.func_arg.push({ id: func._id, name: func.name, unitType: func.argsUnits[i] });
              node.units.push(func.argsUnits[i]);
            }
          }
          for (let i = 0; i < func.returnsNames.length; i += 1) {
            if (func.returnsNames[i] === node.name) {
              node.func_res.push({ id: func._id, name: func.name, unitType: func.returnsUnits[i] });
              node.units.push(func.returnsUnits[i]);
            }
          }
        });
        // eslint-disable-next-line no-param-reassign
        node.func_arg = node.func_arg.filter((arg) => {
          const key = `${arg.name} | ${arg.unitType}`;
          if (!this[key]) {
            this[key] = true;
            return true;
          }
          return false;
        }, Object.create(null));
        // eslint-disable-next-line no-param-reassign
        node.func_res = node.func_res.filter((arg) => {
          const key = `${arg.name} | ${arg.unitType}`;
          if (!this[key]) {
            this[key] = true;
            return true;
          }
          return false;
        }, Object.create(null));
        // eslint-disable-next-line no-param-reassign
        node.units = node.units.filter((arg) => {
          if (!this[arg] && !(arg == null)) {
            this[arg] = true;
            return true;
          }
          return false;
        }, Object.create(null));
        node.markModified('func_arg');
        node.markModified('func_res');
        node.markModified('units');
        node.save((err3) => {
          if (err3) console.error(err3);
        });
      });
    });
  });
}

async function fixNodeInFuncReferences() {
  Node.find({}, (err, nodes) => {
    if (err) console.log(err);
    Function.find({}, (err2, funcs) => {
      if (err2) console.log(err2);
      funcs.forEach((func) => {
        nodes.forEach((node) => {
          if (func.argsNames.length > func.args.length && func.argsNames.indexOf(node.name) > -1) func.args.push(node._id);
          if (func.returnsNames.length > func.returns.length && func.returnsNames.indexOf(node.name) > -1) func.returns.push(node._id);
        });
        func.save((err3) => {
          if (err3) console.error(err3);
        });
      });
      fixFuncInNodeReferences();
    });
  });
}

async function createRelations() {
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
  Node.findOne({ name: 'hours' }, (err, nodeA) => {
    if (err) console.log(err);
    Node.findOne({ name: 'seconds' }, (err2, nodeB) => {
      if (err2) console.log(err2);
      Relation.findOne({ name: 'unitConversion' }, (err3, relation) => {
        if (err3) console.log(err3);
        relation.connects.push({
          start: {
            id: nodeA._id,
            name: nodeA.name,
          },
          end: {
            id: nodeB._id,
            name: nodeB.name,
          },
          mathRelation: 'start / 60',
        });
        relation.connects.push({
          end: {
            id: nodeA._id,
            name: nodeA.name,
          },
          start: {
            id: nodeB._id,
            name: nodeB.name,
          },
          mathRelation: 'start * 60',
        });
        relation.save((err4) => {
          if (err4) console.error(err4);
        });
      });
    });
    Node.findOne({ name: 'milliseconds' }, (err2, nodeB) => {
      if (err2) console.log(err2);
      Relation.findOne({ name: 'unitConversion' }, (err3, relation) => {
        if (err3) console.log(err3);
        relation.connects.push({
          start: {
            id: nodeA._id,
            name: nodeA.name,
          },
          end: {
            id: nodeB._id,
            name: nodeB.name,
          },
          mathRelation: 'start / 3600000',
        });
        relation.connects.push({
          end: {
            id: nodeA._id,
            name: nodeA.name,
          },
          start: {
            id: nodeB._id,
            name: nodeB.name,
          },
          mathRelation: 'start * 3600000',
        });
        relation.save((err4) => {
          if (err4) console.error(err4);
        });
      });
    });
  });
}

async function fixRelations() {
  Node.find({}, (err, nodes) => {
    if (err) console.error(err);
    Relation.findOne({ name: 'unitConversion' }, (err2, relation) => {
      if (err2) console.error(err2);
      relation.connects.forEach((connection) => {
        nodes.forEach((node) => {
          // eslint-disable-next-line no-param-reassign
          if (connection.start.name.indexOf(node.name) > -1) connection.start.id = (node._id);
          // eslint-disable-next-line no-param-reassign
          if (connection.end.name.indexOf(node.name) > -1) connection.end.id = (node._id);
        });
      });
      // eslint-disable-next-line no-param-reassign
      relation.connects = relation.connects.filter((conn) => {
        const key = `${conn.start} | ${conn.end} | ${conn.mathRelation}`;
        if (!this[key]) {
          this[key] = true;
          return true;
        }
        return false;
      }, Object.create(null));
      relation.markModified('connects');
      relation.save((err3) => {
        if (err3) console.error(err3);
      });
    });
  });
}

async function fixTests() {
  Node.findOneAndRemove({ name: 'Napo' }, (err) => {
    if (err) console.error(err);
  });
  Node.findOneAndRemove({ name: 'Mary' }, (err) => {
    if (err) console.error(err);
  });
  Function.findOneAndRemove({ name: 'testFunc' }, (err) => {
    if (err) console.error(err);
  });
  Relation.findOneAndRemove({ name: 'testRel' }, (err) => {
    if (err) console.error(err);
  });
}

async function fillWithFuncs() {
  const funcs = getFunctions();
  const funcProperties = getFuncProperties(funcs);
  const params = getParams(funcs);
  await createFuncJSON();
  await addFuncsToDB(funcProperties);
  await addNodesToDB(params);
  await fixNodeInFuncReferences();
  await createRelations();
  await fixRelations();
  console.log('DONE!');
}

module.exports =
{
  fillWithFuncs,
  fixReferences: fixNodeInFuncReferences,
  fixRelations,
  fixTests,
};
