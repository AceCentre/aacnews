// Load required packages
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var parseDomain = require('parse-domain');
var Domain = require('./domain');

// Define type schema
var LinkSchema   = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  domain: {
  	type: String,
  	ref: 'Domain',
    required: true
  },
  posts: {
    type: Number,
    default: 0
  }
});

var preSave = function(callback) {
  var link = this;

  if (!link.isModified('url')) return callback();

  var parsed = parseDomain(link.url);

  if(parsed == null) {
    return callback({ msg: 'Incorrect url format '});
  }

  var domainName = parsed.domain + '.' + parsed.tld;

  Domain.findOne({ name: domainName }, function(err, domain) {
    if(err) {
      return callback(err);
    }

    if(domain == null) {
      domain = new Domain();
    }

    domain.posts++;
    domain.save(function(err2) {
      return callback(err2);
    });
  });
};

LinkSchema.pre('save', function(callback) {
  console.log('Entradno em SAVE link');
  preSave.bind(this)(callback);
});

LinkSchema.pre('update', function(callback) {
  console.log('Entradno em UPDATE link');
  preSave.bind(this)(callback);
});

// Export the Mongoose model
module.exports = mongoose.model('Link', LinkSchema);
