from flask import Blueprint, jsonify, request
import flask_praetorian
from app import db
from app.helpers.validators import get_club_id_from_shared_club_id
from app.models.Club import Club
from app.models.ClubAdmin import ClubAdmin
from app.scraping.clubs.FootballAssociationClubScraper import FootballAssociationClubScraper
from app.types.enums import ClubType, DataSource

club_bp = Blueprint(
    name="club",
    url_prefix="/club",
    import_name=__name__
)

@club_bp.route("/create", methods=['POST'])
@flask_praetorian.auth_required
def create_club():
    req = request.get_json(force=True)
    club_type = req.get("clubType")
    data_source = req.get("dataSource")
    club_id = req.get("clubId")
    if club_type == ClubType.ALREADY_EXISTS:
        try:
            actual_club_id = get_club_id_from_shared_club_id(club_id)
        except AssertionError:
            return {
                "message" : "Invalid club ID"
            }, 400
        club_count = Club.query.filter_by(club_id=actual_club_id).count()
        if club_count == 0:
            return {
                "message" : "Club does not exist"
            }, 400
        new_club_admin = ClubAdmin(
            club_id=actual_club_id,
            user_id=flask_praetorian.current_user_id
        )
        db.session.add(new_club_admin)
        db.session.commit()
        return jsonify(success=True)
    elif data_source == DataSource.FOOTBALL_ASSOCIATION:
        club_scraper = FootballAssociationClubScraper(
            club_id=club_id
        )
        club_name = club_scraper.get_club_name()
    elif data_source == DataSource.MANUAL:
        club_name = req.get("clubName")
    new_club = Club(
        club_name=club_name,
        data_source_club_id=club_id
    )
    db.session.add(new_club)
    db.session.commit()
    return jsonify(success=True)