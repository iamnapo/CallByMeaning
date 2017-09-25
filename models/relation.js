var mongoose = require('mongoose');

var relationSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  desc: String,
  connects: [{
    start: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
      },
      name: String
    },
    end: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node'
      },
      name: String
    }
  }],
  math_relation: String
});

module.exports = mongoose.model('Relation', relationSchema);