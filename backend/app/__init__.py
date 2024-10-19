from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from config import Config

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    """Create and configure an instance of the Flask application."""
    app = Flask(
        __name__,
        instance_relative_config=True
    )
    app.config.from_object(config_class)

    from app.models import AbrordobMarker, TeamNames

    db.init_app(app)
    migrate.init_app(app, db)
    

    return app