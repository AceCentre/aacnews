// Load required packages
var mongoose = require('mongoose');

// Define type schema
var DraftSchema   = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  premeable: {
    type: String,
    required: true
  },
  spoiler: {
  	type: Date, 
  	default: Date.now 
  },
  author: { 
  	type: String, 
  	ref: 'User' 
  }
});

  
// Export the Mongoose model
module.exports = mongoose.model('Draft', DraftSchema);
