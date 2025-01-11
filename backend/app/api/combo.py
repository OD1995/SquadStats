import traceback
from flask import Blueprint, jsonify, request
from app.data_handlers.MatchesFilterDataHandler import MatchesFilterDataHandler

combo_bp = Blueprint(
    name="combo",
    url_prefix="/combo",
    import_name=__name__
)

@combo_bp.route("/get-matches-filter-data", methods=['GET'])
def get_matches_filter_data():
    try:
        matches_filter_data_handler = MatchesFilterDataHandler(
            club_id=request.args.get("clubId"),
            team_id=request.args.get("teamId"),
        )
        return jsonify(matches_filter_data_handler.get_data())
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400