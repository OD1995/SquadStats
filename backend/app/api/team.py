import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
from app import db
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Team import Team
from app.models.TeamName import TeamName

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
            .order_by(LeagueSeason.data_source_season_name.desc()) \
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
        
@team_bp.route("/get-team-names/<team_id>", methods=['GET'])
def get_team_names(team_id):
    try:
        team_names = db.session.query(TeamName) \
            .filter_by(team_id=UUID(team_id)) \
            .order_by(TeamName.is_default_name.desc()) \
            .all()
        return jsonify(team_names)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400

@team_bp.route("/save-team-names", methods=['POST'])
def save_team_names():
    try:
        req = request.get_json(force=True)
        for team_name_dict in req:
            team_name = TeamName(
                team_name_id=UUID(team_name_dict['team_name_id']) \
                    if 'team_name_id' in team_name_dict else None,
                team_id=UUID(team_name_dict['team_id']),
                team_name=team_name_dict['team_name'],
                is_default_name=team_name_dict['is_default_name']
            )
            db.session.merge(team_name)
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400