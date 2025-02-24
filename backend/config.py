import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    USERNAME = os.environ["DB_USERNAME"]
    PASSWORD = os.environ["DB_PASSWORD"]
    HOST = os.environ["DB_HOST"]
    PORT = os.environ["DB_PORT"]
    DATABASE_NAME = os.environ["DB_DATABASE"]
    SQLALCHEMY_DATABASE_URI = f"mysql+mysqldb://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}?ssl_mode=VERIFY_IDENTITY"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {'pool_size' : 100, 'pool_recycle' : 280}
    # SQLALCHEMY_ECHO = True
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS').lower() == 'true'
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    PRAETORIAN_RESET_SENDER = os.environ.get('PRAETORIAN_RESET_SENDER')
    PRAETORIAN_RESET_URI = os.environ.get('PRAETORIAN_RESET_URI')