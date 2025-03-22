from flask import Flask
from flask_cors import CORS
# from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
import sentry_sdk
from config import Config
from flask_mailman import Mail

db = SQLAlchemy()
# migrate = Migrate()
guard = Praetorian()
mail = Mail()

def create_app(config_class=Config):
    """Create and configure an instance of the Flask application."""
    sentry_sdk.init(
        dsn=config_class.SENTRY_DSN,
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
    )
    
    app = Flask(
        __name__,
        instance_relative_config=True
    )
    app.config.from_object(config_class)
    mail.init_app(app)
    # if app.config['MAIL_SERVER']:
    #     auth = None
    #     if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
    #         auth = (app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
    #     secure = None
    #     if app.config['MAIL_USE_TLS']:
    #         secure = ()
    #     mail_handler = SMTPHandler(
    #         mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
    #         fromaddr='no-reply@' + app.config['MAIL_SERVER'],
    #         toaddrs=app.config['ADMINS'], subject='FFLeagueAnalyser Failure',
    #         credentials=auth, secure=secure
    #     )
    CORS(app)
    db.init_app(app)
    from app.models.User import User
    guard.init_app(app, User)
    from app.api import parent_bp
    app.register_blueprint(parent_bp)
    return app