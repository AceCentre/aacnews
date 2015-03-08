var Slack = require('slack-node');

var exports = module.exports = {};

exports.addPostSlack = function(aPost){
	
	slack = new Slack();
	slack.setWebhook(global.SLACK_HOOK);

	var extended = aPost.text.replace(/(<([^>]+)>)/ig, "");
	var content = "<" + aPost.link + '|' + aPost.title + '>\n' + extended;

   	slack.webhook({
		  "attachments":[
	      {
	         "fallback":"New post",
	         "color":"#3656d8",
	         "fields":[
	            {
	               "title":aPost.author,
	               "value":content,
	               "short":false
	            }
	         ]
	      }
	   	  ]
		}, function(err, response) {
	  		console.log("All posts have been processed successfully");
	});
}