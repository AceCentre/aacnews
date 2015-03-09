var mcapi = require('../node_modules/mailchimp-api/mailchimp');
var moment = require('moment');
var Eggtart = require('eggtart');
var async = require('async');
var Slack = require('slack-node');

// Sucribing email in list - method /api/subscribe (POST)
exports.subscribe = function(req, res){
	// Getting lists
	// list_id = a3d95b59bc
	/*
	mc.lists.lists({}, function(data) {
    	res.json({ title: 'Your MailChimp Lists', lists: data.data });
  	});*/
  	
  	// Getting interest groupings
  	// group_id = 8029
  	/*
  	mc.lists.interestGroupings({"id":"a3d95b59bc"},function(data){
  		res.json(data);
  	});*/
	var anEmail, list_id, group_id, otherGroup, ip_addr, roleType;

	if(req.body.email)
		anEmail = req.body.email;
	else
		return res.send({"error":"You must send an email"});

	otherGroup = req.body.otherGroup;
	ip_addr = req.body.ip_addr;
	roleType = req.body.role;

	mc.lists.subscribe({'id':global.MAILCHIMP_CAMPAIGN_LIST_ID,
						'email':{'email':anEmail},
						'merge_vars':{
							'groupings':[{'id': global.MAILCHIMP_CAMPAIGN_LIST_ID,'groups': ('AACinfo',otherGroup)}],
							'optin_ip':ip_addr,
							'LOCATION':'Unspecified',
							'POINT':'AACinfo',
							'TYPE':roleType
							},
						'email_type':'html',
						'double_optin':false,
						'update_existing':true,
						'replace_interests':false
						},
		function(response){
			res.json({"success":1,"mailchimp_response":response});
		},
    	function(error) {
      		if (error.error) {
        		res.send({"error":error.code + ": " + error.error});
      		} else {
      			res.send({"error":'There was an error subscribing that user'});
      		}
    });
	
}

// Get the list of campaigns - method /api/campaigns (POST)
exports.getCampaigns = function(req, res){
	var campaigns = [];
	mc.campaigns.list({"filters":{ 'status' : 'sent', 'title' : global.PROJECT_TITLE, 'exact' : false}},
		function(response){
			for(var i=0; i < response.data.length; i++){
				var camp = {
					archive_url : response.data[i].archive_url_long,
					date : moment(response.data[i].send_time).format("DD-MM-YYYY"),
					title : response.data[i].title
				}
				campaigns.push(camp);
			}
			res.json(campaigns);
		}
	);
}

// Get newsletter template - method /api/template (GET)
exports.getTemplate = function(req, res){
	var campaigns = [];
	mc.campaigns.list({"filters":{ 'title' : global.MAILCHIMP_CAMPAIGN_NAME, 'exact' : true}},
		function(response){
			if(!response.data)
				return res.send({"error":"Campaign " + global.MAILCHIMP_CAMPAIGN_NAME + " not found"})
			
			var campaign_id = response.data[0].id;
			mc.campaigns.list({"filters":{ 'title' : global.MAILCHIMP_BACKUP_CAMPAIGN_NAME, 'exact' : true}},
				function(response){
					if(response.data.length > 0){ //Backup exists
						var backup_id = response.data[0].id;
						mc.campaigns.delete({"cid":backup_id});
					}
					
					mc.campaigns.replicate({"cid":campaign_id}, 
						function(backup_campaign){
							
							mc.campaigns.update({'cid':backup_campaign.id, 'name':'options', 'value':{'title' : global.MAILCHIMP_BACKUP_CAMPAIGN_NAME}});
							mc.campaigns.content({'cid':backup_campaign.id},function(response){
								res.json(response.html);
							});
					});
				}
			);
			
		}
	);
}

// Send newsletter template - method /api/send (POST)
exports.sendNewsletter = function(req, res){
	var campaigns = [];
	
	mc.campaigns.list({"filters":{ 'title' : global.MAILCHIMP_BACKUP_CAMPAIGN_NAME, 'exact' : true}},
		function(response){
			if(response.data.length > 0){ //Backup exists
				var backup_id = response.data[0].id;

				mc.campaigns.create({
						'type':"regular", 
						'options':{'list_id':response.data[0].list_id,
									'subject': '[' + global.MAILCHIMP_CAMPAIGN_NAME + "] - " + req.body.title,
									'title' :  '[' + global.MAILCHIMP_CAMPAIGN_NAME + "] - " + req.body.title,
								    'from_email':response.data[0].from_email,
									'from_name':response.data[0].from_name,
								    'to_name':response.data[0].to_name}, 
						'content':{'html':req.body.html}},
					function(response){
						var campaign_id = response.id;
						var web_id = response.web_id;
						mc.campaigns.content({'cid':campaign_id},function(response){
							mc.campaigns.send({'cid':campaign_id});
							res.json({"html":response.html,"campaign_id":web_id});
						});

				});
			}
			else
				return res.json({"error":"Newsletter can't be sent"});
		});
	
}

exports.addPostSlack = function(req,res){
	
	slack = new Slack();
	slack.setWebhook(global.SLACK_HOOK);

	var posts = req.body.posts;
	async.each(posts,
			   function(aPost,callback){
			   	var extended = aPost.text.replace(/(<([^>]+)>)/ig, "");
			   	var content = "<" + aPost.link + '|' + aPost.title + '>\n' + extended;

			   	slack.webhook({
				  "attachments":[
			      {
			         "fallback":"New post",
			         "color":"#3656d8",
			         "fields":[
			            {
			               "title":aPost.author_original,
			               "value":content,
			               "short":false
			            }
			         ]
			      }
			   	  ]
				}, function(err, response) {
				  console.log("All posts have been processed successfully");
				});			   	
			   },
			   function(err){
			   	if( err ) {
			      res.json({"message":'Failed to post in Slack'});
			    } else {
			       res.json({"message":'All posts have been processed successfully'});
			    }
			});
}

// Add posts in Delicious (POST)
exports.addPostDelicious = function(req,res){
	var posts = req.body.posts;

	eggtart = new Eggtart(global.USER_DELICIOUS, global.PWD_DELICIOUS);

	async.each(posts,
			   function(aPost,callback){
			   	extended = (aPost.text + ' (' + aPost.author + ')').replace(/[^\x00-\x7F]/g, "");
			   	eggtart.posts().add({"url":aPost.link,"description":aPost.title,"extended":extended,"tags":("aacnews,"+aPost.type.name),"replace":"yes"},function(err,result){
			   		console.log(err);
			   	});
			   },
			   function(err){
			   	if( err ) {
			      console.log('Failed to post in Delicious');
			    } else {
			      console.log('All posts have been processed successfully');
			    }
			   });
}