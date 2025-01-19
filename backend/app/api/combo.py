import traceback
from flask import Blueprint, jsonify, request
from app.data_handlers.MatchesFilterDataHandler import MatchesFilterDataHandler

combo_bp = Blueprint(
    name="combo",
    url_prefix="/combo",
    import_name=__name__
)

@combo_bp.route("/get-matches-or-players-filter-data", methods=['GET'])
def get_mop_filter_data():
    try:
        matches_filter_data_handler = MatchesFilterDataHandler(
            club_id=request.args.get("clubId"),
            team_id=request.args.get("teamId"),
            is_players=request.args.get("isPlayers")
        )
        return jsonify(matches_filter_data_handler.get_data())
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400