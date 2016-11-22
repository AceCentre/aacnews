var Post = require('../models/post');
var PostHistory = require('../models/postHistory');
var moment = require('moment');
var tools = require('./tools');

// New post - method /api/posts (POST)
exports.addPost = function(req, res){
	// Create a new instance of the Post model
	var post = new Post();

	post.title = req.body.title;
	post.text = req.body.text;
	if(req.body.date)
		post.date = moment(req.body.date,"DD/MM/YYYY");
	if(req.body.link)
		post.link = req.body.link;
	if(req.body.publish)
		post.publish = req.body.publish;
	if(req.body.promoted)
		post.promoted = req.body.promoted;
	if(req.body.priority)
		post.priority = req.body.priority;
	if(req.body.author)
		post.author = req.body.author;
	if(req.body.type)
		post.type = req.body.type;

	post.save(function(err,aPost){
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}
		// add post in slack
		tools.addPostSlack(aPost);

		PostHistory.find({"id_post":post._id})
			.sort({'date_creation': -1})
			.limit(1)
			.exec(function(postHistory){
				
				var aPostH = new PostHistory(post);
				if(postHistory)
					postHistory.version = postHistory.version + 1;
				else
					aPostH.id_post = aPost._id;
				aPostH.save(function(err){
					console.log(err);
					res.json({ 
						message: 'Post added to the system!',
			            status: 1, 
			            data: post });
				});
			    
		});
    });
}

// Update post - method /api/posts/:post_id (PUT)
exports.updatePost = function(req, res){
	
	var aPost = new Post(req.body);
	if(req.body.type)
		aPost.type = req.body.type._id;
	console.log("aPost");
	console.log(aPost);
	Post.findByIdAndUpdate(req.params.post_id, {$set : 
			{"title":aPost.title,
			 "text":aPost.text,
			 "type":aPost.type,
			 "link":aPost.link,
			 "promoted":aPost.promoted,
			 "published":aPost.published,
			 "date":moment(req.body.date,"DD/MM/YYYY"),
			 "priority":aPost.priority,
			 "author":aPost.author
			}}, {upsert:false},
		function (err, aPost) {
		  if (err) {
		  	console.log(err)
		  	return res.send(err);
		  }
		  console.log("req.params.post_id: " +req.params.post_id);
		  PostHistory.findOne({"id_post":req.params.post_id})
				.sort({'date_creation': -1})
				.limit(1)
				.exec(function(err,postHistory){
					console.log("postHistory");
					console.log(postHistory);
					var postData = {
						 "title":aPost.title,
						 "text":aPost.text,
						 "type":aPost.type,
						 "link":aPost.link,
						 "promoted":aPost.promoted,
						 "published":aPost.published,
						 "date":moment(req.body.date,"DD/MM/YYYY"),
						 "priority":aPost.priority,
						 "author":aPost.author
					}
					
					var aPostH = new PostHistory(postData);

					if(postHistory){
						aPostH.version = postHistory.version + 1;
					}
					aPostH.id_post = aPost._id;
					
					aPostH.save(function(err){
						console.log(err);
						res.send(aPost);
					});
				    
		  });
		  
	});
}

// Get all posts - method /api/posts (GET)
exports.getPosts = function(req, res){
	
	Post.find({}).
		populate("type").
      sort({'date':'desc'}).
	    sort({'name':'asc'}).
	    exec(
	  		function(err,posts){
	  			if(err) return res.send(err);
	  			res.json(posts);
	  		}
	);
}

// Get all posts published - method /api/posts/publishe (GET)
exports.getPostsPublished = function(req, res){
  var period = req.query.period;
	var today = moment();
  var minDate = null;

  if(!!period) {
    var parsed = period.split(' ');
    var value = parseInt(parsed[0]);
    minDate = moment().subtract(value, parsed[1])
  } else {
    minDate = moment().subtract(1, 'month');
  }

  console.log(minDate)
	Post.find({"published":1,"date": {"$gte": minDate, "$lt": today}}).
		populate("type").
	    sort({'name':'asc'}).
	    exec(
	  		function(err,posts){
	  			if(err) return res.send(err);
	  			res.json(posts);
	  		}
	);
}

// Get one post - method /api/posts/:post_id (GET)
exports.getPost = function(req, res){
	
	Post.findById(req.params.post_id).
			populate("type").
			exec(function(err,aPost){
	  			if(err) return res.send(err);
	  			res.json(aPost);
	  		}
	);
}

// Remove post - method /api/posts/:post_id (DELETE)
exports.deletePost = function(req, res){

	Post.findByIdAndRemove(req.params.post_id, 
		function (err, aPost) {
		  if (err) return res.send(err);
		  PostHistory.remove({"id_post":req.params.post_id},function(err){
		  	res.send({message:"Post was removed",data:aPost});
		  });
	});
}


// Get history about a post - method /api/posts/history/:post_id (GET)
exports.getHistoryPost = function(req, res){
	
	PostHistory.find({"id_post":req.params.post_id}).
			populate("type").
			sort({'date_creation': -1}).
			exec(function(err,posts){
	  			if(err) return res.send(err);
	  			res.json(posts);
	  		}
	);
}

// Get history about a post - method /api/posts/history/:post_id/:version (GET)
exports.getHistoryPostbyVersion = function(req, res){
	
	PostHistory.findOne({"id_post":req.params.post_id,"version":req.params.version}).
			populate("type").
			exec(function(err,posts){
	  			if(err) return res.send(err);
	  			res.json(posts);
	  		}
	);
}

exports.putBulkPublishPosts = function(req, res) {
  var published = parseInt(req.body.published);

  Post.update({
    _id: { $in: req.body.ids }
  }, {
    $set: { published: published }
  }, {
    multi: true
  },
  function() {
    return res.json({});
  });
}

exports.putBulkPromotePosts = function(req, res) {
  var promoted = parseInt(req.body.promoted);

  Post.update({
    _id: { $in: req.body.ids }
  }, {
    $set: { promoted: promoted }
  }, {
    multi: true
  },
  function() {
    return res.json({});
  });
}

