// Load required packages
var mongoose = require('mongoose');

// Define type schema
var DomainSchema   = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  posts: {
    type: Number,
    default: 0
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Domain', DomainSchema);
