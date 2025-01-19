import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
from app import db
from app.data_handlers.LeaderboardDataHandler import LeaderboardDataHandler
from app.data_handlers.PlayerDataHandler import PlayerDataHandler
from app.models.Player import Player


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
        )
        result = matches_data_handler.get_result()
        return jsonify(result)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@player_bp.route("/get-player-info/<player_id>", methods=['GET'])
def get_player_info(player_id):
    try:
        player_data_handler = PlayerDataHandler(
            player_id=player_id
        )
        return jsonify(player_data_handler.get_result())
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400

@player_bp.route("/update-better-player-name", methods=['POST'])
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
        return {
            'message' : traceback.format_exc()
        }, 400