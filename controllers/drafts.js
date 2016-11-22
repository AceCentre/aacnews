var Draft = require('../models/draft');

exports.postDraft = function(req, res){
	// Create a new instance of the Draft model
	var draft = new Draft();

	draft.title = req.body.title;
	draft.preamble = req.body.preamble;
	draft.spoiler = req.body.spoiler;
	draft.author = req.user._id;

	draft.save(function(err, draftSaved){
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}

    res.json({
      message: 'Draft saved!',
      status: 1,
      data: draftSaved
    });
  });
}

exports.putDraft = function(req, res){
	var draft = new Draft(req.body);

	Draft.findByIdAndUpdate(req.params.draft_id, {$set :
			{"title":draft.title,
			 "preamble":draft.preamble,
			 "spoiler":draft.spoiler
			}}, {upsert:false},
		function (err, draftSaved) {
		  if (err) {
		  	console.log(err)
		  	return res.send(err);
		  }

      res.send({
				data: draftSaved
			});

	});
}

exports.getDrafts = function(req, res){
	Draft.find({}).
      sort({'date':'desc'}).
	    sort({'title':'asc'}).
	    exec(
	  		function(err,drafts){
	  			if(err) return res.send(err);
	  			res.json({
						data: drafts
					});
	  		}
	);
}
