var User = require('../models/user');

exports.signupUser = function(req, res){
	// Create a new instance of the User model
	var user = new User();

	user.username = req.body.username.toLowerCase();
	user.password = req.body.password;

	if(req.body.firstname)
	user.firstname = req.body.firstname;
	if(req.body.lastname)
	user.lastname = req.body.lastname;
	if(req.body.email)
	user.email = req.body.email;
	if(req.body.role)
	user.role = req.body.role;

	user.save(function(err){
		if (err) {
		    res.send(err);
		    return;
		}
		res.json({ 
			message: 'User added to the system!',
            status: 1, 
            data: user });
    });
}

exports.getUsers = function(req, res) {
	User.find({}).
		//populate("type").
			//sort({'name':'asc'}).
	    exec(
	  		function(err,users){
	  			if(err) return res.send(err);
	  			res.json(users);
	  		}
	);
}