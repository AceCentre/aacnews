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


exports.addPostTeams = function(aPost){
	var extended = aPost.text.replace(/(<([^>]+)>)/ig, "");
	var content = "<" + aPost.link + '|' + aPost.title + '>\n' + extended;

   const https = require('https');
   const data = '{"@context": "http://schema.org/extensions","@type": "MessageCard", "text": "'+aPost.author+' posted '+content+'"';

   const options = {
     hostname: 'outlook.office.com',
     port: 443,
     path: global.TEAMS_HOOK,
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Content-Length': data.length
     }
   }

   const req = https.request(options, res => {
     console.log(`Teams statusCode: ${res.statusCode}`)
     
     res.on('data', d => {
       process.stdout.write(d)
     })
   })

   req.on('error', error => {
     console.error(error)
   })

   req.write(data)
   req.end()
}