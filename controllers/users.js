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

exports.getUser = function(req, res) {
	User.findById(req.params.user_id).
			exec(function(err,user){
	  			if(err) return res.send(err);
	  			res.json(user);
	  		}
	);
}

exports.putUser = function(req, res){
	
  var userId = req.params.user_id;
	var user = new User(req.body);

  var update = {
    username: user.username,
    role: user.role
  };

  if(req.body.password == "") {
    update.password = user.password;
  }

  User.findByIdAndUpdate(userId,
    {$set: update},
    {upsert: false},
		function (err, user) {
		  if (err) {
		  	console.log(err)
		  	return res.send(err);
		  }

      res.send(user);
	});
}

exports.postUser = function(req, res){
	var newUser = new User(req.body);

	newUser.save(function(err,user){
		if (err) {
			res.send(err);
			return;
		}

    res.json({ 
      message: 'User added to the system!',
      status: 1, 
      data: user
    });
			    
  });
}

exports.deleteUser = function(req, res){
	User.findByIdAndRemove(req.params.user_id, 
		function (err, user) {
      if (err)
        return res.send(err);

      res.send({
        message: "User was removed",
        data: user
      });
	});
}