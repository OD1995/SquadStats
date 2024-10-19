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