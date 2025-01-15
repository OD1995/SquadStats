import traceback
from flask import Blueprint, jsonify, request

from app.data_handlers.LeaderboardDataHandler import LeaderboardDataHandler


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
            team_id_filter=request.args.get("selectedTeamId"),
            season=request.args.get("selectedSeason"),
            opposition=request.args.get("selectedOpposition"),     
        )
        result = matches_data_handler.get_result()
        return jsonify(result)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400