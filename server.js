var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var fs = require('fs');
var passport = require('passport');
var jwtauth = require('./jwtauth.js');
var bodyParser = require('body-parser');
var mcapi = require('./node_modules/mailchimp-api/mailchimp');
var authController = require('./controllers/auth');
var userController = require('./controllers/users');
var typeController = require('./controllers/types');
var postController = require('./controllers/posts');
var newsletterController = require('./controllers/newsletters');
var mailchimpController = require('./controllers/mailchimp');
var Eggtart = require('eggtart');

var configuration = JSON.parse(
  fs.readFileSync("configuration.json")
);
var urlMongo = process.env.MONGO_DB_URL || configuration.MONGO_DB_URL;
mongoose.connect('mongodb://' + urlMongo);

// set MailChimp API key here
var mailchimp_key = process.env.MAILCHIMP_API_KEY || configuration.MAILCHIMP_API_KEY;
mc = new mcapi.Mailchimp(mailchimp_key);
global.PROJECT_TITLE = process.env.PROJECT_TITLE || configuration.PROJECT_TITLE;
global.MAILCHIMP_CAMPAIGN_NAME = process.env.MAILCHIMP_CAMPAIGN_NAME || configuration.MAILCHIMP_CAMPAIGN_NAME;
global.MAILCHIMP_BACKUP_CAMPAIGN_NAME = process.env.MAILCHIMP_BACKUP_CAMPAIGN_NAME || configuration.MAILCHIMP_BACKUP_CAMPAIGN_NAME;
global.MAILCHIMP_CAMPAIGN_LIST_ID = process.env.MAILCHIMP_CAMPAIGN_LIST_ID || configuration.MAILCHIMP_CAMPAIGN_LIST_ID;
// Set Delicious usr/pwd
global.USER_DELICIOUS = process.env.USER_DELICIOUS || configuration.USER_DELICIOUS;
global.PWD_DELICIOUS = process.env.PWD_DELICIOUS || configuration.PWD_DELICIOUS;

// Set Slack
global.SLACK_HOOK = process.env.SLACK_HOOK || configuration.SLACK_HOOK;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Access-Token");
    next();
}

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(allowCrossDomain);

// Use the passport package in our application
app.use(passport.initialize());

var requireAuth = function(req, res, next) {
	if (!req.user) {
		res.end('Not authorized', 401)
	}	else {
		next()
	}
}

var multipart = require('connect-multiparty')
    , multipartMiddleware = multipart();

// Create our Express router
var router = express.Router();

// users
router.route('/users/signup').post(userController.signupUser);
router.route('/login').post(authController.login);

// types
router.route('/types').post(jwtauth, requireAuth, typeController.addType);
router.route('/types').get(typeController.getTypes);
router.route('/types/:type_id').get(jwtauth, requireAuth, typeController.getType);
router.route('/types/:type_id').put(jwtauth, requireAuth, typeController.updateType);
router.route('/types/:type_id').delete(jwtauth, requireAuth, typeController.deleteType);

// posts
router.route('/posts').post(postController.addPost);
router.route('/posts').get(jwtauth, requireAuth, postController.getPosts);
router.route('/posts/published').get(jwtauth, requireAuth, postController.getPostsPublished);
router.route('/posts/:post_id').get(jwtauth, requireAuth, postController.getPost);
router.route('/posts/:post_id').put(jwtauth, requireAuth, postController.updatePost);
router.route('/posts/:post_id').delete(jwtauth, requireAuth, postController.deletePost);
router.route('/posts/history/:post_id').get(jwtauth, requireAuth, postController.getHistoryPost);
router.route('/posts/history/:post_id/:version').get(jwtauth, requireAuth, postController.getHistoryPostbyVersion);

// newsletters
router.route('/newsletters').post(jwtauth, requireAuth, newsletterController.addNewsletter);
router.route('/newsletters').get(jwtauth, requireAuth, newsletterController.getNewsletters);
router.route('/newsletters/:newsletter_id').get(jwtauth, requireAuth, newsletterController.getNewsletter);
router.route('/newsletters/:newsletter_id').put(jwtauth, requireAuth, newsletterController.updateNewsletter);
router.route('/newsletters/:newsletter_id').delete(jwtauth, requireAuth, newsletterController.deleteNewsletter);

// mailchimp
router.route('/subscribe').post(mailchimpController.subscribe);
router.route('/campaigns').get(mailchimpController.getCampaigns);
router.route('/template').get(mailchimpController.getTemplate);
router.route('/send').post(mailchimpController.sendNewsletter);

// delicious
router.route('/delicious/posts').post(mailchimpController.addPostDelicious);

// slack
router.route('/slack/posts').post(mailchimpController.addPostSlack);

app.use('/api', router);
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.use(function(req, res, next) {
	console.log(req.user);
    if (req.user == null && req.path.indexOf('/admin') === 0)
    {
        res.redirect('/login');
    }
    next(); 
});

app.get('/*', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

var port = process.env.AACNEWS_PORT || configuration.AACNEWS_PORT;
app.listen(port);
console.log('Listening on port ' + port);