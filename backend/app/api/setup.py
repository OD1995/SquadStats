from flask import Blueprint
from app import db
from app.models.Club import Club

setup_bp = Blueprint(
    name="setup",
    import_name=__name__
)

@setup_bp.route("/", methods=['POST'])
def create_club():
    club = Club("Test Club")
    db.session.add(club)
    db.session.flush()
    return "ok"