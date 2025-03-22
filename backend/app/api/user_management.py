import traceback
from flask import Blueprint, jsonify, request#, session
# from flask_mailman import EmailMessage
from flask_praetorian.exceptions import (
    InvalidTokenHeader,
    InvalidResetToken,
    MissingToken,
    MisusedRegistrationToken
)
from app import guard, db
from app.helpers.misc import do_error_handling
from app.models.User import User

user_management_bp = Blueprint(
    "user_management",
    __name__,
    url_prefix="/user_management"
)

@user_management_bp.route("/register", methods=['POST'])
def register():
    req = request.get_json(force=True)
    email = req.get('email')
    password = req.get('password')
    if db.session.query(User).filter_by(email=email).count() >= 1:
        return {
            "message" : "Email already registered"
        }, 400
    new_user = User(
        email=email,
        password=guard.hash_password(password)
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(
        {
            "message" : "User registered",
            "ss_user" : new_user.get_ss_user_data()
        }
    )

@user_management_bp.route("/login", methods=['POST'])
def login():
    req = request.get_json(force=True)
    email = req.get('email')
    password = req.get('password')
    user:User = guard.authenticate(email, password)
    return jsonify({'ss_user' : user.get_ss_user_data()})

@user_management_bp.route("/refresh", methods=['POST'])
# @flask_praetorian.auth_required
def refresh():
    old_token = request.get_json(force=True)['access_token']
    new_token = guard.refresh_jwt_token(old_token)
    # user = guard.get_user_from_registration_token(new_token)
    return jsonify({'new_token' : new_token})

@user_management_bp.route("/forgotten-password", methods=['POST'])
def forgotten_password():
    try:
        req = request.get_json(force=True)
        email = req.get('email', None)
        user = db.session.query(User) \
            .filter_by(email=email) \
            .first()
        guard.send_reset_email(
            email=email,
            user=user
        )
        return jsonify(
            {
                "message" : "Password reset email sent"
            }
        )
    except Exception as e:
        return do_error_handling(e)
    
@user_management_bp.route("/reset-password", methods=['POST'])
def reset_password():
    try:
        req = request.get_json(force=True)
        new_password = req.get('newPassword', None)
        reset_token = req.get('resetToken', None)
        token_user = guard.validate_reset_token(reset_token)
        if token_user is None:
            return jsonify(
                {
                    "message" : "Invalid request. No user found matching supplied token."
                }
            ), 400
        token_user.password = guard.hash_password(new_password)
        db.session.commit()
        return jsonify(
            {
                "message" : "Your password has been reset, please go to the Login page"
            }
        )
    except (InvalidTokenHeader, InvalidResetToken, MissingToken, MisusedRegistrationToken):
        return jsonify(
                {
                    "message" : "Invalid token in reset URL. Please renew your password reset request."
                }
            ), 400
    except Exception as e:
        return do_error_handling(e)