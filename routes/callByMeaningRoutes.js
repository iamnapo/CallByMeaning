'use strict';

var express = require('express');
var router = express.Router();
var math = require('mathjs');

var Function = require('../models/function');
var Relation = require('../models/relation');

router.get('/', function (req, res) {
  res.send('Hello. This is the path to call a function by meaning. Detailed information can be found <a href=../docs/CALLBYMEANING.md>here</a>. Check <a href=../cbm/call>this</a>');
});

router.get('/call', function (req, res) {
  res.send('This is the path to use for calling. Send a POST request with the parameters in its body.');
});

router.post('/call', function (req, res) {
  req.body.inputNodes = req.body.inputNodes || [];
  req.body.inputUnits = req.body.inputUnits || [];
  req.body.inputVars = req.body.inputVars || [];
  req.body.outputNodes = req.body.outputNodes || [];
  req.body.outputUnits = req.body.outputUnits || [];
  var returnCode = eval(req.headers.returncode) || false;
  // Get what the inputs are, their values and in what units
  var inputNodes = req.body.inputNodes instanceof Object ? req.body.inputNodes : req.body.inputNodes.split(' ').join('').split(',');
  var inputUnits = req.body.inputUnits instanceof Object ? req.body.inputUnits : req.body.inputUnits.split(' ').join('').split(',');
  var inputVars = req.body.inputVars instanceof Object ? req.body.inputVars : req.body.inputVars.split(' ').join('').split(',');
  // Get what results the caller wants and in what units
  var outputNodes = req.body.outputNodes instanceof Object ? req.body.outputNodes : req.body.outputNodes.split(' ').join('').split(',');
  var outputUnits = req.body.outputUnits instanceof Object ? req.body.outputUnits : req.body.outputUnits.split(' ').join('').split(',');
  if (outputNodes == null || outputNodes.length !== outputUnits.length) {
    return res.status(400).send('A function must have at least one output and every output must have its unit.');
  }
  if (inputNodes.length !== inputUnits.length || inputNodes.length !== inputVars.length) {
    return res.status(400).send('Input parameters must have the same length.');
  }
  Function.find({argsNames: inputNodes}).populate('results').exec(function (err, funcs) {
    if (err) {
      console.log(err);
    } else {
      if (funcs.length === 0) {
        return res.status(418).send('Could not find a function with these types of arguments/returns.');
      }
      // if I'm here, funcs contains all the functions with the required input Nodes (but not the in the same units necessarily)
      for (let func of funcs) {
        let foundMatchForNodes = true;
        if (func.returnsNames.length === outputNodes.length) {
          for (let i = 0; i < outputNodes.length; i++) {
            if (func.returnsNames[i] !== outputNodes[i]) {
              foundMatchForNodes = false;
            }
          }
        } else {
          foundMatchForNodes = false;
        }
        if (foundMatchForNodes) {
          if (returnCode) {
            var codeRes = {
              function: func.codeFile,
              desc: func.desc
            };
            return res.json(codeRes);
          }
          // if I'm here, func is a function with correct inputs AND correct outputs, but not in the same units
          var correctInputs = [];
          if (inputUnits.length === 0) {
            // only way to check for null and undefined
          } else {
            for (let i = 0; i < inputUnits.length; i++) {
              let foundRelationIn = false;
              if (func.argsUnits[i] === inputUnits[i]) {
                correctInputs[i] = inputVars[i];
                continue;
              } else {
                // find "unitConversion" relation
                Relation.findOne({name: 'unitConversion'}, function (err, relation) {
                  if (err) {
                    console.log(err);
                  } else {
                    for (let connection of relation.connects) {
                      // if I find the correct connection 
                      if (connection.start.name === inputUnits[i] && connection.end.name === func.argsUnits[i]) {
                        foundRelationIn = true;
                        // compute correct input value
                        let mathRelation = connection.mathRelation;
                        mathRelation = mathRelation.replace('start', JSON.stringify(inputVars[i]));
                        correctInputs[i] = math.eval(mathRelation);
                        // check next input
                        break;
                      }
                    }
                  }
                });
                if (!foundRelationIn) {
                  return res.status(418).send('Could not find a relation between theses types of input units and the ones in the DB.');
                }
              }
            }
          }
          // calculate result
          var funcToRun = require('../library/' + func.codeFile.substring(5));
          var funcResult = funcToRun.apply(null, correctInputs);
          if (func.returnsUnits[0] === outputUnits[0]) {
            return res.send(JSON.stringify(funcResult));
          }
          // find "unitConversion" relation
          let foundRelationOut = false;
          Relation.findOne({name: 'unitConversion'}, function (err, relation) {
            for (let connection of relation.connects) {
              // if I find the correct connection 
              if (connection.start.name === outputUnits[0] && connection.end.name === func.returnsUnits[0]) {
                foundRelationOut = true;
                // compute correct output value
                let mathRelation = connection.mathRelation;
                mathRelation = mathRelation.replace('start', JSON.stringify(funcResult));
                mathRelation = JSON.stringify(math.eval(mathRelation));
                return res.send(mathRelation);
              }
            }
            if (!foundRelationOut) {
              return res.status(418).send('Could not find a relation between theses types of output units and the ones in the DB.');
            }
          });
        } else {
          return res.status(418).send('Could not find a function with these outputs.');
        }
      }
    }
  });
});

module.exports = router;