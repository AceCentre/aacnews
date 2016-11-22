// Load required packages
var mongoose = require('mongoose');

// Define type schema
var DraftSchema   = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  preamble: {
    type: String,
    required: true
  },
  spoiler: {
  	type: String
  },
  author: {
  	type: String,
  	ref: 'User',
    required: true
  },
  updated: {
    type: Date,
    default: Date.now
  }
});


// Export the Mongoose model
module.exports = mongoose.model('Draft', DraftSchema);
