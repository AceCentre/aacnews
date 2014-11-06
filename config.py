import os
basedir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY ='123456790'
MAILCHIMP_CAMPAIGN_NAME ='AACNews Monthly'
MAILCHIMP_APIKEY ='somekeyhere'

DATABASE_FILE ='aacnews_db.sqlite'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, DATABASE_FILE)
SQLALCHEMY_ECHO =True

# Login Admin
USERNAME ='someemail@gmail.com'
PASSWORD ='pass'

