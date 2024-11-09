import traceback
from uuid import UUID
from flask import Blueprint, jsonify
from app import db
from app.models import Season
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Team import Team
from app.types.enums import DataSource, Sport

team_bp = Blueprint(
    name="team",
    url_prefix="/team",
    import_name=__name__
)

@team_bp.route("/get-seasons/<team_id>", methods=['GET'])
def get_seasons(team_id):
    try:
        team = db.session.query(Team) \
            .filter_by(team_id=UUID(team_id)) \
            .first()
        league_ids = [
            tl.league_id
            for tl in team.team_leagues
        ]
        league_seasons = db.session.query(LeagueSeason) \
            .join(League) \
            .filter(League.league_id.in_(league_ids)) \
            .all()
        league_season_info_list = [
            x.get_league_season_info()
            for x in league_seasons
        ]
        return jsonify(league_season_info_list), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    

@team_bp.route("/get/<team_id>", methods=['GET'])
def get_team(team_id):
    try:
        team = db.session.query(Team) \
            .filter_by(team_id=UUID(team_id)) \
            .first()
        return team.get_team_info(), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@team_bp.route("/get-matches/<team_id>/<season_id>", methods=['GET'])
def get_team_matches(team_id, season_id):
    pass