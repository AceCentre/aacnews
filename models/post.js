// Load required packages
var mongoose = require('mongoose');

// Define type schema
var PostSchema   = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
  	type: Date, 
  	default: Date.now 
  },
  link: {
    type: String,
    default:""
  },
  published: {
    type: Number,
    default: 0
  },
  promoted: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    default: 0
  },
  author: {
    type: String,
    default: ""
  },
  type: { 
  	type: String, 
  	ref: 'Type' 
  }
});

  
// Export the Mongoose model
module.exports = mongoose.model('Post', PostSchema);