## AACinfo Monthly

This is a flask-admin based system to manage posted, short publicly posted snippets of news/links and generate a mailchimp newsletter. Its really quite basic. 

A working version of this can be seen at http://AACinfo.email 

## To Install and run

1. pip install -r requirements.txt
2. Edit the various settings in config.live.py. You will need a mailchimp API key. You will also need to have already setup a campaign titled the same as 'MAILCHIMP_CAMPAIGN_NAME' with a template. Copy the one from templates/mcAACNews.html for now - you can change this as you go. If you want to use the auto-posting of published links to delicious.com then add your delicious username/password. Leave the username blank if you don't want to use this feature. 
3. mv config.live.py config.py
4. python app.py (NB: The first time this is run the sqllite database is created with some dummy data)
5. login via /admin with the details you set in config 
6. Create some posts. Preview your newsletter. Publish. 
7. Make a cup of tea. 

## Tips

If you want to change it from Monthly to weekly take a look at app.py. Its buried in there in a couple of places


