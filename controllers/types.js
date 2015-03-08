var Type = require('../models/type');

// New type - method /api/types (POST)
exports.addType = function(req, res){
	// Create a new instance of the Type model
	var type = new Type();

	type.name = req.body.name;
	type.priority = req.body.priority;

	type.save(function(err){
		if (err) {
		    res.send(err);
		    return;
		}
		res.json({ 
			message: 'Type added to the system!',
            status: 1, 
            data: type });
    });
}

// Update type - method /api/types/:type_id (PUT)
exports.updateType = function(req, res){

	Type.findByIdAndUpdate(req.params.type_id, { $set: { "name": req.body.name, "priority": req.body.priority }}, 
		function (err, aType) {
		  if (err) return res.send(err);
		  res.send(aType);
	});
}

// Get all types - method /api/types (GET)
exports.getTypes = function(req, res){
	
	Type.find({}).
	    sort({'name':'asc'}).
	    exec(
	  		function(err,types){
	  			if(err) return res.send(err);
	  			res.json(types);
	  		}
	);
}

// Get one type - method /api/types/:type_id (GET)
exports.getType = function(req, res){
	
	Type.findById(req.params.type_id, function(err,aType){
	  			if(err) return res.send(err);
	  			res.json(aType);
	  		}
	);
}

// Remove type - method /api/types/:type_id (DELETE)
exports.deleteType = function(req, res){

	Type.findByIdAndRemove(req.params.type_id, 
		function (err, aType) {
		  if (err) return res.send(err);
		  res.send({message:"Type was removed",data:aType});
	});
}