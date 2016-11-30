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
  	ref: 'Domain'
  },
  posts: {
    type: Number,
    default: 0
  }
});

var preSave = function(callback) {
  var link = this;

  if (!link.isModified('url')) return callback();

  link.posts++;
  var parsed = parseDomain(link.url);

  if(parsed == null) {
    return callback({ msg: 'Incorrect url format '});
  }

  var domainName = parsed.domain + '.' + parsed.tld;

  Domain
    .findOne({ name: domainName })
    .exec()
    .then(function(domain) {
      if(domain == null) {
        domain = new Domain({ name: domainName })
      }

      domain.posts++;
      return domain.save();
    })
    .then(function(domain) {
      link.domain = domain._id
      callback();
    })
    .catch(function(err) {
      console.log(err);
      callback(err);
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
