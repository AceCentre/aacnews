// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var jwt = require('jwt-simple');
var moment = require('moment');

passport.use(new BasicStrategy(
  function(username, password, callback) {

    User.findOne({ username: username.toLowerCase() }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });

exports.login = function(req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    var username = req.body.username || '';
    var password = req.body.password || '';
    
    if (username == '' || password == '') {
        console.log("Not username or password entered");
        return res.json({"login":0});
    }
 
    User.findOne({ username: username.toLowerCase() }).exec(
      function (err, user) {
        if (err) {
            console.log(err);
            return res.json({"login":0});
        }
        
         // No user found with that username
        if (!user) { return  res.json({"login":0}); }
        
        user.comparePassword(password, function(isMatch) {
            if (!isMatch) {
                console.log("Attempt failed to login with " + user.username);
                return res.json({"login":0});
            }
            
            user.save(function(err){
              var expires = moment().add(7,'days').valueOf();
              var token = jwt.encode({
                iss: user.username,
                exp: expires
              }, "BARCELONA");

              return res.json(
                  {
                    "login":1, 
                    "user_id":user._id, 
                    "role":user.role,
                    "token" : token,
                    "expires": expires
                  });
            });
            
            
        });
 
    });
};