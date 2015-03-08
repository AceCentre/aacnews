// Load required packages
var mongoose = require('mongoose');

// Define type schema
var NewsletterSchema   = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
  	type: Date, 
  	default: Date.now 
  },
  preamble: {
    type: String,
    default:""
  },
  spoiler: {
    type: String,
    default:""
  },
  html: {
    type: String,
    default:""
  },
  campaign_id: {
    type: String,
    default:""
  }
});

  
// Export the Mongoose model
module.exports = mongoose.model('Newsletter', NewsletterSchema);