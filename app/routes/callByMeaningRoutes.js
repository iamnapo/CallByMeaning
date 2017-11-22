'use strict';

const express = require('express');
const router = new express.Router();
const request = require('request');
const math = require('mathjs');
const JSON = require('../dev/jsonfn');

const Function = require('../models/function');
const Relation = require('../models/relation');

router.get('/', (req, res) => {
  return res.send('Hello. This is the path to call a function by meaning. Detailed information can be found <a href=https://github.com/iamnapo/CallByMeaning/>here</a>. Check <a href=../cbm/call>this</a>');
});

router.get('/call', (req, res) => {
  return res.send('This is the path to use for calling. Send a POST request with the parameters in its body.');
});

router.post('/call', (req, res) => {
  req.body.inputNodes = req.body.inputNodes || [];
  req.body.inputUnits = req.body.inputUnits || [];
  req.body.inputVars = req.body.inputVars || [];
  req.body.outputNodes = req.body.outputNodes || [];
  req.body.outputUnits = req.body.outputUnits || [];
  let returnCode = eval(req.headers.returncode) || false;
  let inputNodes = req.body.inputNodes instanceof Object ? req.body.inputNodes : req.body.inputNodes.split(' ').join('').split(',');
  let inputUnits = req.body.inputUnits instanceof Object ? req.body.inputUnits : req.body.inputUnits.split(' ').join('').split(',');
  let inputVars = req.body.inputVars instanceof Object ? req.body.inputVars : req.body.inputVars.split(' ').join('').split(',');
  inputVars = inputVars.map((inputVar) => {
    try {
      let t = JSON.parse(inputVar);
      return t;
    } catch (error) {
      return inputVar;
    }
  });
  let outputNodes = req.body.outputNodes instanceof Object ? req.body.outputNodes : req.body.outputNodes.split(' ').join('').split(',');
  let outputUnits = req.body.outputUnits instanceof Object ? req.body.outputUnits : req.body.outputUnits.split(' ').join('').split(',');
  if (outputNodes == null || outputNodes.length !== outputUnits.length) {
    return res.status(400).send('A function must have at least one output and every output must have its unit.');
  }
  if (inputNodes.length !== inputUnits.length) {
    return res.status(400).send('Input parameters must have the same length.');
  }
  request.post({uri: req.protocol + '://' + req.get('host') + req.originalUrl[0] + 'gbm/search/', form: {inputNodes: inputNodes, outputNodes: outputNodes}}, function(err, response, body) {
    if (err) console.error(err);
    if (response.statusCode !== 200) return res.status(response.statusCode).send(body);
    Function.find({codeFile: {$in: JSON.parse(body).map((item) => item.function)}, argsUnits: inputUnits, returnsUnits: outputUnits}).populate('results').exec((err, funcs) => {
      if (err) console.error(err);
      if (funcs.length !== 0) {
        let func = funcs[0]; // Only possibility
        if (returnCode) {
          let codeRes = {
            function: func.codeFile,
            description: func.desc,
          };
          return res.json(codeRes);
        }
        let funcToRun = require('../../library/' + func.codeFile);
        let funcResult = funcToRun(...inputVars);
        return res.send(JSON.stringify(funcResult));
      } else {
        Function.find({codeFile: {$in: JSON.parse(body).map((item) => item.function)}}).populate('results').exec((err, funcs) => {
          if (err) console.log(err);
          Relation.findOne({name: 'unitConversion'}, (err, relation) => {
            if (err) console.error(err);
            let funcsChecked = 0;
            for (let func of funcs) {
              funcsChecked++;
              let correctInputs = [];
              if (inputUnits.length !== 0) {
                for (let i = 0; i < inputUnits.length; i++) {
                  if (func.argsUnits[i] === inputUnits[i]) {
                    correctInputs[i] = inputVars[i];
                  } else {
                    let foundInputRelation = false;
                    try {
                      let inMath = math.unit(inputUnits[i]);
                      let argMath = math.unit(func.argsUnits[i]);
                      correctInputs[i] = inputVars[i] * math.to(argMath, inMath).toNumber();
                      foundInputRelation = true;
                    } catch (error) {
                      for (let connection of relation.connects) {
                        if (connection.start.name === inputUnits[i] && connection.end.name === func.argsUnits[i]) {
                          foundInputRelation = true;
                          let mathRelation = connection.mathRelation;
                          mathRelation = mathRelation.replace('start', JSON.stringify(inputVars[i]));
                          correctInputs[i] = math.eval(mathRelation);
                          break;
                        }
                      }
                    }
                    if (!foundInputRelation) {
                      return res.status(418).send('There is a function whith these concepts, but given units can\'t be interpreted.');
                    }
                  }
                }
              }
              let funcToRun = require('../../library/' + func.codeFile);
              let funcResult = funcToRun(...correctInputs);
              if (func.returnsUnits[0] === outputUnits[0]) {
                if (returnCode) {
                  let codeRes = {
                    function: func.codeFile,
                    desc: func.desc,
                  };
                  return res.json(codeRes);
                }
                return res.send(JSON.stringify(funcResult));
              } else {
                let foundOutputRelation = false;
                try {
                  let outMath = math.unit(outputUnits[0]);
                  let returnMath = math.unit(func.returnsUnits[0]);
                  let mathRelation = funcResult * math.to(returnMath, outMath).toNumber();
                  foundOutputRelation = true;
                  if (returnCode) {
                    let codeRes = {
                      function: func.codeFile,
                      description: func.desc,
                    };
                    return res.json(codeRes);
                  }
                  return res.send(JSON.stringify(mathRelation));
                } catch (error) {
                  for (let connection of relation.connects) {
                    if (connection.start.name === outputUnits[0] && connection.end.name === func.returnsUnits[0]) {
                      foundOutputRelation = true;
                      let mathRelation = connection.mathRelation;
                      mathRelation = mathRelation.replace('start', JSON.stringify(funcResult));
                      mathRelation = JSON.stringify(math.eval(mathRelation));
                      if (returnCode) {
                        let codeRes = {
                          function: func.codeFile,
                          description: func.desc,
                        };
                        return res.json(codeRes);
                      }
                      return res.send(mathRelation);
                    }
                  }
                }
                if (!foundOutputRelation) {
                  return res.status(418).send('There is a function whith these concepts, but given units can\'t be interpreted.');
                }
              }
              if (funcsChecked === funcs.length) return res.status(418).send('Function not found in DB.');
            }
          });
        });
      }
    });
  });
});

module.exports = router;