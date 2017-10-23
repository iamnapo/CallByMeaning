'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');

var Function = require('../models/function');

router.get('/', function (req, res) {
  return res.send('Hello. This is the path to search by meaning. Detailed information can be found <a href=https://github.com/iamnapo/CallByMeaning/>here</a>. Check <a href=../gbm/search>/search</a>');
});

router.get('/search', function (req, res) {
  return res.send('This is the path to use for searching. Send a POST request with the parameters in its body.');
});

router.post('/search', function (req, res) {
  req.body.inputNodes = req.body.inputNodes || [];
  if (req.body.outputNodes == null) return res.status(400).send('A function must have at least one output');
  var inputNodes = req.body.inputNodes instanceof Object ? req.body.inputNodes : req.body.inputNodes.split(' ').join('').split(',');
  var outputNodes = req.body.outputNodes instanceof Object ? req.body.outputNodes : req.body.outputNodes.split(' ').join('').split(',');
  Function.find({argsNames: inputNodes, returnsNames: outputNodes}, function (err, funcs) {
    if (err) console.log(err);
    if (funcs.length !== 0) {
      let temp = [];
      for (let t = 0; t < funcs.length; t ++) {
        temp.push({function: funcs[0].codeFile, desc: funcs[0].desc});
      }
      return res.json(temp);
    }
    for (let i = 0; i < outputNodes.length; i++) {
      if (res.headersSent) break;
      request.get(req.protocol + '://' + req.get('host') + req.originalUrl[0] + 'gbn/c/' + outputNodes[i], function(err, response, body) {
        if (response.statusCode !== 200) return res.status(418).send('Could not interpret the node: ' + outputNodes[i]);
        outputNodes[i] = JSON.parse(body).name;
        if (i === outputNodes.length - 1) {
          if (inputNodes.length === 0) {
            Function.find({argsNames: inputNodes, returnsNames: outputNodes}, function (err, funcs) {
              if (err) console.log(err);
              if (funcs.length !== 0) {
                let temp = [];
                for (let t = 0; t < funcs.length; t ++) {
                  temp.push({function: funcs[0].codeFile, desc: funcs[0].desc});
                }
                return res.json(temp);
              }
              return res.status(418).send('Function not found.');
            });
          } else {
            for (let j = 0; j < inputNodes.length; j++) {
              if (res.headersSent) break;              
              request.get(req.protocol + '://' + req.get('host') + req.originalUrl[0] + 'gbn/c/' + inputNodes[j], function(err, response, body) {
                if (response.statusCode !== 200) return res.status(418).send('Could not interpret the node: ' + inputNodes[j]);
                outputNodes[i] = JSON.parse(body).name;
                if (j === inputNodes.length - 1) {
                  Function.find({argsNames: inputNodes, returnsNames: outputNodes}, function (err, funcs) {
                    if (err) console.log(err);
                    if (funcs.length !== 0) {
                      let temp = [];
                      for (let t = 0; t < funcs.length; t ++) {
                        temp.push({function: funcs[0].codeFile, desc: funcs[0].desc});
                      }
                      return res.json(temp);
                    }
                    return res.status(418).send('Function not found.');
                  });
                } 
              }); 
            }
          }
        }
      });
    }
  });
});

router.all('/:anything', function (req, res) {
  return res.status(404).send('Hmm... How did you end up here?');
});

router.all('/search/:anything', function (req, res) {
  return res.status(404).send('Hmm... How did you end up here?');
});

module.exports = router;