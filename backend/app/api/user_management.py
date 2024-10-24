from flask import Blueprint, request
from app import guard, db
from app.models import User

user_management_bp = Blueprint(
    "user_management",
    __name__,
    url_prefix="/user_management"
)

@user_management_bp.route("/register", methods=['POST'])
def register():
    req = request.get_json(force=True)
    error_messages = []
    email = req.get('email')
    password = req.get('password')
    return {
        "message" : "User registered"
    }, 200

@user_management_bp.route("/login", methods=['POST'])
def login():
    req = request.get_json(force=True)
    email = req.get('email')
    password = req.get('password')
    user = guard.authenticate(email, password)
    return {
        'access_token' : guard.encode_jwt_token(user)
    }, 200

@user_management_bp.route("/refresh", methods=['POST'])
def refresh():
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    return {
        'access_token' : new_token
    }, 200

@user_management_bp.route("/reset-password")
def reset_password():
    
    req = request.get_json(force=True)
    email = req.get('email', None)
    new_password = req.get('password', None)    
    user = User.query.get(email=email)
    user.password = guard.hash_password(new_password)
    db.session.commit()
    return {
        "message" : "Password reset"
    }, 200