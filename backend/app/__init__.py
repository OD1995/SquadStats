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

    from app.models import (
        AbrordobMarker,
        Club,
        Sport,
        Team,
        TeamName,
        Season,
        TeamSeason,
        Competition,
        DataSource,
        Metric,
        Match,
        Player,
        PlayerMatchPerformance,
    )

    db.init_app(app)
    migrate.init_app(app, db)

    from app.api import setup_bp

    app.register_blueprint(setup_bp)

    return app