'use strict';

const mongoose = require('mongoose');

let nodeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  desc: String,
  units: [],
  func_arg: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Function',
    },
    name: String,
    unitType: String,
  }],
  func_res: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Function',
    },
    name: String,
    unitType: String,
  }],
});

module.exports = mongoose.model('Node', nodeSchema);