// Load required packages
var mongoose = require('mongoose');
var Link = require('./link');
var parseDomain = require('parse-domain');

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
    required: true
  },
  linkInfo: {
    type: String,
    ref: 'Link'
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

var preSave = function(callback) {
  var post = this;

  if (!post.isModified('link')) return callback();

  Link
    .findOne({ url: post.link })
    .exec()
    .then(function(link) {
      if(link == null) {
        link = new Link({
          url: post.link
        });
      }

      console.log("callbacking 2");
      return link.save();
    })
    .then(function(link) {
      post.linkInfo = link._id;
      console.log("callbacking");
      callback();
    })
    .catch(function(err) {
      console.log(err);
    });

};

PostSchema.pre('save', function(callback) {
  console.log('Entradno em SAVE posts');
  console.log(this.link);
  preSave.bind(this)(callback);
});

PostSchema.pre('update', function(callback) {
  console.log('Entradno em UPDATE posts');
  console.log(this.link);
  preSave.bind(this)(callback);
});

// Export the Mongoose model
module.exports = mongoose.model('Post', PostSchema);
