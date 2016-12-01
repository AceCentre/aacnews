require('pmx').init();
var express = require('express');
var expressSession = require('express-session');
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
var draftController = require('./controllers/drafts');

var configuration = JSON.parse(
  fs.readFileSync("configuration.json")
);
var urlMongo = process.env.MONGO_DB_URL || configuration.MONGO_DB_URL;
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://' + urlMongo);

// set MailChimp API key here
var mailchimp_key = process.env.MAILCHIMP_API_KEY || configuration.MAILCHIMP_API_KEY;
mc = new mcapi.Mailchimp(mailchimp_key);
global.PROJECT_TITLE = process.env.PROJECT_TITLE || configuration.PROJECT_TITLE;
global.MAILCHIMP_CAMPAIGN_NAME = process.env.MAILCHIMP_CAMPAIGN_NAME || configuration.MAILCHIMP_CAMPAIGN_NAME;
global.MAILCHIMP_BACKUP_CAMPAIGN_NAME = process.env.MAILCHIMP_BACKUP_CAMPAIGN_NAME || configuration.MAILCHIMP_BACKUP_CAMPAIGN_NAME;
global.MAILCHIMP_CAMPAIGN_LIST_ID = process.env.MAILCHIMP_CAMPAIGN_LIST_ID || configuration.MAILCHIMP_CAMPAIGN_LIST_ID;
global.MAILCHIMP_GROUPING_ID = process.env.MAILCHIMP_GROUPING_ID || configuration.MAILCHIMP_GROUPING_ID;
global.MAILCHIMP_GROUP_AACINFO = process.env.MAILCHIMP_GROUP_AACINFO || configuration.MAILCHIMP_GROUP_AACINFO;
// Set Delicious usr/pwd
global.USER_DELICIOUS = process.env.USER_DELICIOUS || configuration.USER_DELICIOUS;
global.PWD_DELICIOUS = process.env.PWD_DELICIOUS || configuration.PWD_DELICIOUS;
// Set Diigo user/pwd/key
global.USER_DIIGO = process.env.USER_DIIGO || configuration.USER_DIIGO;
global.PWD_DIIGO = process.env.PWD_DIIGO || configuration.PWD_DIIGO;
global.KEY_DIIGO = process.env.KEY_DIIGO || configuration.KEY_DIIGO;

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
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(allowCrossDomain);
app.use(expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));


// Use the passport package in our application
app.use(passport.initialize());
app.use(passport.session());

var requireAuth = function(req, res, next) {
	if (!req.user) {
		res.end('Not authorized', 401)
	}	else {
		next()
	}
}

var requireRole = function(role) {
  return function (req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    }
    else {
      res.end('Not authorized', 401)
    }
  };
}

var multipart = require('connect-multiparty')
    , multipartMiddleware = multipart();

// Create our Express router
var router = express.Router();

// users
router.route('/users/signup').post(userController.signupUser);
router.route('/login').post(authController.login);
router.route('/users').get(jwtauth, requireAuth, requireRole('admin'), userController.getUsers);
router.route('/users').post(jwtauth, requireAuth, requireRole('admin'), userController.postUser);
router.route('/users/:user_id').get(jwtauth, requireAuth, requireRole('admin'), userController.getUser);
router.route('/users/:user_id').put(jwtauth, requireAuth, requireRole('admin'), userController.putUser);
router.route('/users/:user_id').delete(jwtauth, requireAuth, requireRole('admin'), userController.deleteUser);

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
router.route('/posts/published').put(jwtauth, requireAuth, postController.putBulkPublishPosts);
router.route('/posts/promoted').put(jwtauth, requireAuth, postController.putBulkPromotePosts);
router.route('/posts/:post_id').get(jwtauth, requireAuth, postController.getPost);
router.route('/posts/:post_id').put(jwtauth, requireAuth, postController.updatePost);
router.route('/posts/:post_id').delete(jwtauth, requireAuth, postController.deletePost);
router.route('/posts/history/:post_id').get(jwtauth, requireAuth, postController.getHistoryPost);
router.route('/posts/history/:post_id/:version').get(jwtauth, requireAuth, postController.getHistoryPostbyVersion);
router.route('/updatepostslinkscount').delete(jwtauth, requireAuth, requireRole('admin'), postController.updateLinksCount);

// newsletters
router.route('/newsletters').post(jwtauth, requireAuth, newsletterController.addNewsletter);
router.route('/newsletters').get(jwtauth, requireAuth, newsletterController.getNewsletters);
router.route('/newsletters/:newsletter_id').get(jwtauth, requireAuth, newsletterController.getNewsletter);
router.route('/newsletters/:newsletter_id').put(jwtauth, requireAuth, newsletterController.updateNewsletter);
router.route('/newsletters/:newsletter_id').delete(jwtauth, requireAuth, newsletterController.deleteNewsletter);

// mailchimp
router.route('/subscribe').post(mailchimpController.subscribe);
router.route('/campaigns').get(mailchimpController.getCampaigns);
router.route('/campaigns/drafts').get(jwtauth, requireAuth, draftController.getDrafts);
router.route('/campaigns/drafts/:draft_id').put(jwtauth, requireAuth, draftController.putDraft);
router.route('/campaigns/drafts').post(jwtauth, requireAuth, draftController.postDraft);
router.route('/template').get(mailchimpController.getTemplate);
router.route('/send').post(mailchimpController.sendNewsletter);

// delicious
router.route('/delicious/posts').post(mailchimpController.addPostDelicious);

// diigo
router.route('/diigo/posts').post(mailchimpController.addPostsDiigo);

// slack
router.route('/slack/posts').post(mailchimpController.addPostSlack);

app.use('/api', router);
app.use(express.static(path.join(__dirname, 'public'))); //  "public" off of current is root

app.use(function(req, res, next) {
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
