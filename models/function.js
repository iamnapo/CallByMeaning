var mongoose = require('mongoose');

var functionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  desc: String,
  codeFile: {
    type: String,
    default: 'default.js'
  },
  args: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node'
  }],
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node'
  }],
  argsUnits: [],
  returnsUnits: []
});

module.exports = mongoose.model('Function', functionSchema);