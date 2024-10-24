from flask import Blueprint, jsonify
import flask_praetorian
from app import db
from app.models.Club import Club

setup_bp = Blueprint(
    name="setup",
    url_prefix="/setup",
    import_name=__name__
)

@setup_bp.route("/create-club", methods=['POST'])
@flask_praetorian.auth_required
def create_club():
    club = Club("Test Club")
    db.session.add(club)
    db.session.commit()
    return "ok"

@setup_bp.route("/get-clubs")
def get_clubs():
    clubs = Club.query.all()
    return jsonify(clubs)