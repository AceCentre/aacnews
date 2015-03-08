// Load required packages
var mongoose = require('mongoose');

// Define type schema
var TypeSchema   = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  priority: {
    type: String,
    required: true
  }
});

  
// Export the Mongoose model
module.exports = mongoose.model('Type', TypeSchema);