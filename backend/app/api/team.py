import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
import flask_praetorian
from app import db
from app.data_handlers.TeamOverview import TeamOverview
from app.models.Club import Club
from app.models.Match import Match
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamName import TeamName
from app.models.TeamSeason import TeamSeason
from app.types.enums import DataSource, Sport

team_bp = Blueprint(
    name="team",
    url_prefix="/team",
    import_name=__name__
)

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
    
@team_bp.route("/create-manual", methods=['POST'])
@flask_praetorian.auth_required
def create_team():
    try:
        req = request.get_json(force=True)
        club_id = UUID(req.get('clubId'))
        team_name_str = req.get('teamName')
        new_team = Team(
            club_id=club_id,
            sport_id=Sport.FOOTBALL,
            data_source_id=DataSource.MANUAL,
            data_source_team_id=None
        )
        new_team_name = TeamName(
            team_id=new_team.team_id,
            team_name=team_name_str,
            is_default_name=True
        )
        db.session.add(new_team)
        db.session.add(new_team_name)
        db.session.commit()
        current_user = flask_praetorian.current_user()
        return {
            "ss_user" : current_user.get_ss_user_data(),
            "new_team_id" : new_team.team_id
        }, 200
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
        team_names = db.session.query(TeamName) \
            .filter_by(team_id=UUID(team_name_dict['team_id'])) \
            .order_by(TeamName.is_default_name.desc()) \
            .all()
        return jsonify(team_names)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@team_bp.route("/get-team-overview-stats/<team_id>", methods=['GET'])
def get_team_overview_stats(team_id):
    try:
        team_overview = TeamOverview(team_id=team_id)
        team_overview_data = team_overview.get_data()
        return jsonify(team_overview_data)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@team_bp.route("/get-player-information/<team_id>", methods=['GET']) #
def get_team_player_information(team_id):
    try:
        players = db.session.query(Player) \
            .join(PlayerMatchPerformance) \
            .join(Match) \
            .join(TeamSeason) \
            .filter(TeamSeason.team_id == UUID(team_id)) \
            .all()
        team = db.session.query(Team) \
            .filter(Team.team_id == UUID(team_id)) \
            .first()
        return jsonify(
            {
                'team_name' : team.get_default_team_name(),
                'club_id' : team.club_id,
                'players' : [
                    p.to_dict()
                    for p in sorted(players, key=lambda x: x.get_best_name())
                ],
                'team' : team
            }
        )
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400