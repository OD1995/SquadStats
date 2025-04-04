import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
from flask.config import T
import flask_praetorian
from app import db
from app.data_handlers.LeaderboardDataHandler import LeaderboardDataHandler
from app.data_handlers.PlayerDataHandler import PlayerDataHandler
from app.helpers.misc import do_error_handling, get_unappearance_metrics
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason


player_bp = Blueprint(
    name="player",
    url_prefix="/player",
    import_name=__name__
)

@player_bp.route("/get-leaderboard-data", methods=['GET'])
def get_leaderboard_data():
    try:
        matches_data_handler = LeaderboardDataHandler(
            club_id=request.args.get("clubId"),
            team_id=request.args.get("teamId"),
            metric=request.args.get("metric"),
            split_by=request.args.get("splitBy"),
            team_id_filter=request.args.get("teamIdFilter"),
            season_filter=request.args.get("seasonFilter"),
            opposition_filter=request.args.get("oppositionFilter"),
            per_game=request.args.get("perGame"),
            min_apps=request.args.get("minApps"),
            player_id_filter=request.args.get("playeridFilter"),
            year_filter=request.args.get("yearFilter"),
            month_filter=request.args.get("monthFilter"),
        )
        result = matches_data_handler.get_result()
        return jsonify(result)
    except Exception as e:
        return do_error_handling(e)
    
@player_bp.route("/get-player-info/<player_id>", methods=['GET'])
def get_player_info(player_id):
    try:
        player_data_handler = PlayerDataHandler(
            player_id=player_id
        )
        return jsonify(player_data_handler.get_result())
    except Exception as e:
        return do_error_handling(e)

@player_bp.route("/update-better-player-name", methods=['POST'])
@flask_praetorian.auth_required
def update_better_player_name():
    try:
        data = request.get_json()
        player_id = data['playerId']
        better_player_name = data['betterPlayerName'] if data['betterPlayerName'] != "" else None
        player = db.session.query(Player) \
            .filter_by(player_id=UUID(player_id)) \
            .first()
        player.better_player_name = better_player_name
        db.session.commit()
        return jsonify(player.to_dict(include_both_names=True))
    except Exception as e:
        return do_error_handling(e)

@player_bp.route("/get-player-teams/<player_id>", methods=['GET'])
def get_player_teams(player_id):
    try:
        player = db.session.query(Player) \
            .filter(Player.player_id == UUID(player_id)) \
            .first()
        teams = db.session.query(Team) \
            .join(TeamSeason) \
            .join(Match) \
            .join(PlayerMatchPerformance) \
            .join(Metric) \
            .filter(
                PlayerMatchPerformance.player_id == UUID(player_id),
                Metric.metric_name.not_in(get_unappearance_metrics())
            ) \
            .all()
        return jsonify(
            {
                'player_name' : player.get_best_name(),
                'teams' : [
                    t.get_team_info()
                    for t in teams
                ],
                'club_id' : player.club_id
            }
        )
    except Exception as e:
        return do_error_handling(e)