'use strict';

var express = require('express');
var router = express.Router();

var Function = require('../models/function');

router.get('/', function (req, res) {
  res.send('Hello. This is the path to search by meaning. Detailed information can be found <a href=https://github.com/iamnapo/CallByMeaning/>here</a>. Check <a href=../gbm/search>/search</a>');
});

router.get('/search', function (req, res) {
  res.send('This is the path to use for searching. Send a POST request with the parameters in its body.');
});

router.post('/search', function (req, res) {
  req.body.inputNodes = req.body.inputNodes || [];
  req.body.inputUnits = req.body.inputUnits || [];
  req.body.outputNodes = req.body.outputNodes || [];
  req.body.outputUnits = req.body.outputUnits || [];
  // Get what the inputs are and in what units
  var inputNodes = req.body.inputNodes instanceof Object ? req.body.inputNodes : req.body.inputNodes.split(' ').join('').split(',');
  var inputUnits = req.body.inputUnits instanceof Object ? req.body.inputUnits : req.body.inputUnits.split(' ').join('').split(',');
  // Get what results the caller wants and in what units
  var outputNodes = req.body.outputNodes instanceof Object ? req.body.outputNodes : req.body.outputNodes.split(' ').join('').split(',');
  var outputUnits = req.body.outputUnits instanceof Object ? req.body.outputUnits : req.body.outputUnits.split(' ').join('').split(',');
  if (outputNodes == null || outputNodes.length !== outputUnits.length) {
    return res.status(400).send('A function must have at least one output and every output must have its unit.');
  }
  if (inputNodes && inputUnits && inputNodes.length !== inputUnits.length) {
    return res.status(400).send('Input parameters must have the same length.');
  }
  Function.find({argsNames: inputNodes || [], argsUnits: inputUnits || []}).populate('results').exec(function (err, funcs) {
    if (err) {
      console.log(err);
    } else {
      if (funcs == null) {
        return res.status(418).send('Could not find a function with these types of arguments/returns.');
      }
      for (let func of funcs) {
        let foundMatch = true;
        if (func.returnsNames.length === outputNodes.length) {
          for (let i = 0; i < outputNodes.length; i++) {
            if (func.returnsNames[i] !== outputNodes[i]) {
              foundMatch = false;
            }
            if (func.returnsUnits[i] !== outputUnits[i]) {
              foundMatch = false;
            }
          }
        } else {
          foundMatch = false;
        }
        if (foundMatch) {
          var temp = {
            function: func.codeFile,
            desc: func.desc
          };
          return res.json(temp);
        }
      }
      return res.status(418).send('Function not found.');
    }
  });
});

module.exports = router;