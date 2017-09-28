var Node = require('../models/Node');
var Function = require('../models/Function');
var Relation = require('../models/Relation');

function clearDB() {
  Node.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  Function.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  Relation.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log('DB cleared.');
}

function addNodes() {
  Node.create({
    name: 'time',
    desc: 'A specified time instance e.g 10 seconds.',
    units: ['days', 'hours', 'minutes', 'seconds']
  });

  Node.create({
    name: 'date',
    desc: 'A specified date.',
    units: ['date']
  });

  Node.create({
    name: 'zodiac',
    desc: 'A person\'s astrogical sign.',
    units: ['word']
  });

  Node.create({
    name: 'hours',
    desc: 'Unit of measurement of time.',
    units: ['hours']
  });

  Node.create({
    name: 'seconds',
    desc: 'Unit of measurement of time.',
    units: ['seconds']
  });
  console.log('Nodes added.');
}

function addFunctions() {
  Function.create({
    name: 'getTime',
    desc: 'This function returns the current time in seconds since 01/01/1970',
    codeFile: 'getTime.js',
    returnsUnits: ['seconds']
  });

  Function.create({
    name: 'toTime',
    desc: 'This function takes a date and returns the time in seconds from 01/01/1970 to that date.',
    codeFile: 'toTime.js',
    argsUnits: ['date'],
    returnsUnits: ['seconds']
  });

  Function.create({
    name: 'getZodiac',
    desc: 'This function takes a person\'s birthday and returns their astrological sign base on that day.',
    codeFile: 'getZodiac.js',
    argsUnits: ['date'],
    returnsUnits: ['word']
  });
  console.log('Functions added.');
}

function addRelations() {
  Relation.create({
    name: 'requiredBy',
    desc: 'First node is required to define/give meaning to second node.'
  });

  Relation.create({
    name: 'representsA',
    desc: 'First node is a different representation of second node'
  });
  console.log('Relations added.');

  Relation.create({
    name: 'unitConversion',
    desc: 'The two nodes are differents unit of measurement of the same thing.'
  });
}

function fixNodes() {
  // 'time' node
  Function.findOne({name: 'getTime'}, function (err, func) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'time'}, function (err, node) {
        if (err) {
          console.log(err);
        } else {
          node.func_res.push({id: func._id, name: func.name, unitType: 'seconds'});
          node.save();
        }
      });
    }
  });
  Function.findOne({name:'toTime'}, function (err, func) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'time'}, function (err, node) {
        if (err) {
          console.log(err);
        } else {
          node.func_res.push({id: func._id, name: func.name, unitType: 'seconds'});
          node.save();
        }
      });
    }
  });

  // 'date' node
  Function.findOne({name: 'toTime'}, function (err, func) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'date'}, function (err, node) {
        if (err) {
          console.log(err);
        } else {
          node.func_arg.push({id: func._id, name: func.name, unitType: 'date'});
          node.save();
        }
      });
    }
  });
  Function.findOne({name: 'getZodiac'}, function (err, func) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'date'}, function (err, node) {
        if (err) {
          console.log(err);
        } else {
          node.func_arg.push({id: func._id, name: func.name, unitType: 'date'});
          node.save();
        }
      });
    }
  });

  // 'zodiac' node
  Function.findOne({name: 'getZodiac'}, function (err, func) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'zodiac'}, function (err, node) {
        if (err) {
          console.log(err);
        } else {
          node.func_res.push({id: func._id, name: func.name, unitType: 'word'});
          node.save();
        }
      });
    }
  });
  console.log('Nodes fixed.');
}

function fixFunctions() {
  // 'getTime'
  Node.findOne({name: 'time'}, function (err, node) {
    if (err) {
      console.log(err);
    } else {
      Function.findOne({name: 'getTime'}, function (err, func) {
        if (err) {
          console.log(err);
        } else {
          func.returns.push(node._id);
          func.returnsNames.push(node.name);
          func.save();
          func.returnsNames = func.returnsNames.sort();
          func.save();
        }
      });
    }
  });

  // 'toTime
  Node.findOne({name: 'time'}, function (err, node) {
    if (err) {
      console.log(err);
    } else {
      Function.findOne({name: 'toTime'}, function (err, func) {
        if (err) {
          console.log(err);
        } else {
          func.returns.push(node._id);
          let temp = func.returnsNames;
          temp.push(node.name);
          temp.sort();
          func.returnsNames = temp;
          func.save();
        }
      });
    }
  });
  Node.findOne({name: 'date'}, function (err, node) {
    if (err) {
      console.log(err);
    } else {
      Function.findOne({name: 'toTime'}, function (err, func) {
        if (err) {
          console.log(err);
        } else {
          func.args.push(node._id);
          let temp = func.argsNames;
          temp.push(node.name);
          temp.sort();
          func.argsNames = temp;
          func.save();
        }
      });
    }
  });

  // 'getZodiac'
  Node.findOne({name: 'date'}, function (err, node) {
    if (err) {
      console.log(err);
    } else {
      Function.findOne({name: 'getZodiac'}, function (err, func) {
        if (err) {
          console.log(err);
        } else {
          func.args.push(node._id);
          let temp = func.argsNames;
          temp.push(node.name);
          temp.sort();
          func.argsNames = temp;
          func.save();
        }
      });
    }
  });
  Node.findOne({name: 'zodiac'}, function (err, node) {
    if (err) {
      console.log(err);
    } else {
      Function.findOne({name: 'getZodiac'}, function (err, func) {
        if (err) {
          console.log(err);
        } else {
          func.returns.push(node._id);
          let temp = func.returnsNames;
          temp.push(node.name);
          temp.sort();
          func.returnsNames = temp;
          func.save();
        }
      });
    }
  });
  console.log('Functions fixed.');
}


function fixRelations() {
  // 'requiredBy'
  Node.findOne({name: 'date'}, function (err, nodeA) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'zodiac'}, function (err, nodeB) {
        if (err) {
          console.log(err);
        } else {
          Relation.findOne({name: 'requiredBy'}, function (err, relation) {
            if (err) {
              console.log(err);
            } else {
              var start = {
                id: nodeA._id,
                name: nodeA.name
              };
              var end = {
                id: nodeB._id,
                name: nodeB.name
              };
              relation.connects.push({start: start, end: end, mathRelation: ''});
              relation.save();
            }
          });
        }
      });
    }
  });

  // 'representsA'
  Node.findOne({name: 'date'}, function (err, nodeA) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'time'}, function (err, nodeB) {
        if (err) {
          console.log(err);
        } else {
          Relation.findOne({name: 'representsA'}, function (err, relation) {
            if (err) {
              console.log(err);
            } else {
              var start = {
                id: nodeA._id,
                name: nodeA.name
              };
              var end = {
                id: nodeB._id,
                name: nodeB.name
              };
              relation.connects.push({start: start, end: end, mathRelation: ''});
              relation.save();
            }
          });
        }
      });
    }
  });

  // 'unitConversion'
  Node.findOne({name: 'hours'}, function (err, nodeA) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'seconds'}, function (err, nodeB) {
        if (err) {
          console.log(err);
        } else {
          Relation.findOne({name: 'unitConversion'}, function (err, relation) {
            if (err) {
              console.log(err);
            } else {
              var start = {
                id: nodeA._id,
                name: nodeA.name
              };
              var end = {
                id: nodeB._id,
                name: nodeB.name
              };
              relation.connects.push({start: start, end: end, mathRelation: 'start / 60'});
              relation.save();
            }
          });
        }
      });
    }
  });

  Node.findOne({name: 'seconds'}, function (err, nodeA) {
    if (err) {
      console.log(err);
    } else {
      Node.findOne({name: 'hours'}, function (err, nodeB) {
        if (err) {
          console.log(err);
        } else {
          Relation.findOne({name: 'unitConversion'}, function (err, relation) {
            if (err) {
              console.log(err);
            } else {
              var start = {
                id: nodeA._id,
                name: nodeA.name
              };
              var end = {
                id: nodeB._id,
                name: nodeB.name
              };
              relation.connects.push({start: start, end: end, mathRelation: 'start * 60'});
              relation.save();
            }
          });
        }
      });
    }
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