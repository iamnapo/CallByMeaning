'use strict';

const mongoose = require('mongoose');

let functionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  desc: String,
  codeFile: {
    type: String,
    default: './js/default.js',
  },
  args: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
  }],
  returns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
  }],
  argsNames: [],
  argsUnits: [],
  returnsNames: [],
  returnsUnits: [],
});

module.exports = mongoose.model('Function', functionSchema);