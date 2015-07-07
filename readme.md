## AACinfo Monthly

This is a node/angular/mongo based system to manage posted, short publicly posted snippets of news/links and generate a mailchimp newsletter. Its really quite basic. 

A working version of this can be seen at [http://AACinfo.email](http://AACinfo.email)

## To Install and run

1. `git clone https://github.com/ACECentre/aacnews` 
2. `git clone https://gist.github.com/72fbc92215c2d321cf1f.git && mv 72fbc92215c2d321cf1f/aacnews-config.sh .. && rm -rf 72fbc92215c2d321cf1f`
3. Edit the various settings in *aacnews-config.sh*  You will need (or feel free to edit out lines that are calling these various things):
 * [a mongo db setup](https://www.mongodb.org). 
 * a mailchimp API key. You will also need to have already setup a campaign titled the same as 'MAILCHIMP_CAMPAIGN_NAME' with a template. Copy the one from templates/mcAACNews.html for now - you can change this as you go. 
 * If you want to use the auto-posting of published links to delicious.com then add your [delicious](http://delicious.com) and [diigo](https://www.diigo.com/) username/password. 
 * Add a [slack webhook](https://my.slack.com/services/new/incoming-webhook)

3. `source aacnews-config.sh && node server.js`
4. login via /admin with the details you set in config 
5. Create some posts. Preview your newsletter. Publish. 
6. Make a cup of tea. 

