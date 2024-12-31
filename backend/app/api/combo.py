import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
import flask_praetorian
from app import db
from app.data_handlers.ClubOverview import ClubOverview
from app.data_handlers.MatchesFilterDataHandler import MatchesFilterDataHandler
from app.helpers.validators import get_club_id_from_shared_club_id
from app.models.Club import Club
from app.models.ClubAdmin import ClubAdmin
from app.models.DataSource import DataSource
from app.scrapers.clubs.FootballAssociationClubScraper import FootballAssociationClubScraper
from app.types.enums import ClubType, DataSource as DataSourceEnum

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
        return jsonify(matches_filter_data_handler.get_data()), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400