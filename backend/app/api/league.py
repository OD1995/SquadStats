# from flask import Blueprint, jsonify, request

# from app.models.League import League
# from app.models.LeagueSeason import LeagueSeason


# league_bp = Blueprint(
#     name="league",
#     url_prefix="/league",
#     import_name=__name__
# )

# @league_bp.route("/create-new-league", methods=['POST'])
# def create_new_league():
#     try:
#         req = request.get_json(force=True)
#         team_id = req.get('teamId')
#         league_name = req.get('leagueName')
#         new_league = League(
#             league_name=league_name,
#             data_source_id=None,
#             data_source_league_id=None
#         )
#         new_league_season = LeagueSeason(
#             league_id=new_league.league_id,
#             data_source_season_name=
#         )
#         return jsonify(matches_filter_data_handler.get_club_seasons()), 200
#     except Exception as e:
#         return {
#             'message' : traceback.format_exc()
#         }, 400