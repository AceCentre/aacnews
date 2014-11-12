# NB: Rename this to config.py :)
import os
basedir = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY ='123456790'
MAILCHIMP_CAMPAIGN_NAME ='AACNews Monthly'
MAILCHIMP_BACKUP_CAMPAIGN_NAME ='AACNews Monthly Backup'
MAILCHIMP_APIKEY ='mailchimp-api-here'

DATABASE_FILE ='aacnews_db.sqlite'
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, DATABASE_FILE)
SQLALCHEMY_ECHO =True

# Login Admin
USERNAME ='admin'
PASSWORD ='pass'

