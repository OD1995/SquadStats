from flask import Blueprint, jsonify
from app import db
from app.models import Season, Team
from app.types.enums import DataSource, Sport

team_bp = Blueprint(
    name="team",
    url_prefix="/team",
    import_name=__name__
)

@team_bp.route("/get-seasons/<team_id>", methods=['GET'])
def get_seasons(team_id):
    team = db.session.query(Team) \
    .filter_by(team_id=team_id) \
    .first()
    if team.sport.sport_id == Sport.FOOTBALL.value:
        return db.session.query(Season) \
        .filter_by(data_source_id=DataSource.FOOTBALL_ASSOCIATION) \
        .all()
    return {
        "message" : "Unexpected sport (not football)"
    }, 400