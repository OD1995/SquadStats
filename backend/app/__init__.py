from flask import Flask
from flask_cors import CORS
# from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
from config import Config

db = SQLAlchemy()
# migrate = Migrate()
guard = Praetorian()

def create_app(config_class=Config):
    """Create and configure an instance of the Flask application."""
    app = Flask(
        __name__,
        instance_relative_config=True
    )
    app.config.from_object(config_class)
    CORS(app)

    # from app.models import (
    #     AbrordobMarker,
    #     Club,
    #     Sport,
    #     Team,
    #     TeamName,
    #     Season,
    #     TeamSeason,
    #     Competition,
    #     DataSource,
    #     Metric,
    #     Match,
    #     Player,
    #     PlayerMatchPerformance,
    #     User,
    #     ClubAdmin
    # )
    db.init_app(app)
    # migrate.init_app(app, db)
    from app.models.User import User
    guard.init_app(app, User)


    # from app.api import setup_bp, other_bp
    # app.register_blueprint(setup_bp)
    # app.register_blueprint(other_bp)
    from app.api import parent_bp
    app.register_blueprint(parent_bp)

    return app