var Newsletter = require('../models/newsletter');
var moment = require('moment');

// New newsletter - method /api/newsletter (POST)
exports.addNewsletter = function(req, res){
	// Create a new instance of the Newsletter model
	var newsletter = new Newsletter();

	newsletter.title = req.body.title;
	if(req.body.date)
		newsletter.date = moment(req.body.date,"DD/MM/YYYY");
	if(req.body.preamble)
		newsletter.preamble = req.body.preamble;
	if(req.body.spoiler)
		newsletter.spoiler = req.body.spoiler;
	if(req.body.html)
		newsletter.html = req.body.html;
	if(req.body.campaign_id)
		newsletter.campaign_id = req.body.campaign_id;

	newsletter.save(function(err){
		if (err) {
			console.log(err);
		    res.send(err);
		    return;
		}
		res.json({ 
			message: 'Newsletter added to the system!',
            status: 1, 
            data: newsletter });
    });
}

// Update newsletter - method /api/newsletters/:newsletter_id (PUT)
exports.updateNewsletter = function(req, res){
	
	var aNewsletter = new Newsletter(req.body);
	
	Newsletter.findByIdAndUpdate(req.params.newsletter_id, {$set : 
			{"title":aNewsletter.title,
			 "preamble":aNewsletter.preamble,
			 "spoiler":aNewsletter.spoiler,
			 "date":moment(req.body.date,"DD/MM/YYYY"),
			 "campaign_id":aNewsletter.campaign_id
			}}, {upsert:false},
		function (err, aNewsletter) {
		  if (err) {
		  	console.log(err)
		  	return res.send(err);
		  }
		  res.send(aNewsletter);
	});
}

// Get all newsletters - method /api/newsletters (GET)
exports.getNewsletters = function(req, res){
	
	Newsletter.find({}).
	    sort({'date':'desc'}).
	    exec(
	  		function(err,newsletters){
	  			if(err) return res.send(err);
	  			res.send(newsletters);
	  		}
	);
}

// Get one newsletter - method /api/newsletters/:newsletter_id (GET)
exports.getNewsletter = function(req, res){
	Newsletter.findById(req.params.newsletter_id).
			exec(function(err,aNewsletter){
	  			if(err) return res.send(err);
	  			res.json(aNewsletter);
	  		}
	);
}

// Remove newsletter - method /api/newsletter/:newsletter_id (DELETE)
exports.deleteNewsletter = function(req, res){

	Newsletter.findByIdAndRemove(req.params.newsletter_id, 
		function (err, aNewsletter) {
		  if (err) return res.send(err);
		  res.send({message:"Newsletter was removed",data:aNewsletter});
	});
}