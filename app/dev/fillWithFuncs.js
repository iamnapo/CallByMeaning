'use strict';

var Function = require('../models/function');

function replaceAll (target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement);
}

function getFunctions () {
  let allFuncs = require('./funcs.json'); // even those not exported
  let temp = [];
  for (let func of allFuncs) {
    if (func.scope === 'static' && func.memberof === '_') {
      temp.push(func);
    }
  }
  return temp;
}

// function getParams (funcs) {
//   let temp = [];
//   for (let func of funcs) {
//     if (func.params && func.params.length !== 0) {
//       for (let param of func.params) {
//         temp.push({name: param.name, description: param.description});
//       }
//     }
//     if (func.returns && func.returns.length !== 0) {
//       for (let returns of func.returns) {
//         temp.push({name: returns.name || 'return value', description: returns.description});
//       }
//     }
//   }
//   return temp;
// }

function getFuncNamesAndDescriptions (funcs) {
  let temp = [];
  for (let func of funcs) {
    // handle newline character in desc before adding it
    func.description = replaceAll(func.description, '\n', ' ');
    temp.push({name: func.name, desc: func.description});
  }
  return temp;
}

function addFuncNamesAndDescToDB (funcNamesAndDesc) {
  for (let func of funcNamesAndDesc) {
    Function.create({
      name: func.longname,
      desc: func.desc,
      codeFile: './js/' + func.name + '.js'
    }, function (err) {
      if (err) console.log(err);
    });
  }
}

function addFuncArgsNamesAndArgsUnits (funcNamesAndDesc) {
  for (let func of funcNamesAndDesc) {
    Function.create({
      name: func.name,
      desc: func.desc,
      codeFile: './js/' + func.name + '.js'
    }, function (err) {
      if (err) console.log(err);
    });
  }
}

function addFuncReturnsNamesAndReturnsUnits (funcNamesAndDesc) {
  for (let func of funcNamesAndDesc) {
    Function.create({
      name: func.name,
      desc: func.desc,
      codeFile: './js/' + func.name + '.js'
    }, function (err) {
      if (err) console.log(err);
    });
  }
}

function fixFuncNodeReferences (funcNamesAndDesc) {
  for (let func of funcNamesAndDesc) {
    Function.create({
      name: func.meta.filename.slice(0,-3),
      desc: func.desc,
      codeFile: './js/' + func.meta.filename
    }, function (err) {
      if (err) console.log(err);
    });
  }
}

function fillWithFuncs () {
  let funcs = getFunctions();
  // first get all functions and their descriptions and add them to the DB
  let funcNamesAndDesc = getFuncNamesAndDescriptions(funcs);
  // first create an object for each function and provide name, desc, codeFile
  addFuncNamesAndDescToDB(funcNamesAndDesc);
  // then fill argsNames and argsUnits
  addFuncArgsNamesAndArgsUnits(funcs);
  // then fill returnsNames and returnsUnits
  addFuncReturnsNamesAndReturnsUnits(funcs);
  // and lastly create/find corresponding nodes and fix references
  fixFuncNodeReferences(funcs);
}

module.exports = fillWithFuncs;