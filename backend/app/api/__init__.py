from flask import Blueprint
from app.api.other import other_bp
from app.api.setup import setup_bp
from app.api.user_management import user_management_bp

# parent_bp = Blueprint()
# parent_bp.register_blueprint(setup_bp)
# parent_bp.register_blueprint(other_bp)
# parent_bp.register_blueprint(user_management_bp)