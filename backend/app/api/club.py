from uuid import UUID
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
    elif data_source in [
        DataSource.FOOTBALL_ASSOCIATION.value
    ]:
        save_teams = False
        match data_source:
            case DataSource.FOOTBALL_ASSOCIATION.value:
                club_scraper = FootballAssociationClubScraper(
                    fa_club_id=club_id
                )
                save_teams = True
        club_name = club_scraper.get_club_name()
    elif data_source == DataSource.MANUAL.value:
        club_name = req.get("clubName")
    new_club = Club(
        club_name=club_name,
        data_source_club_id=club_id
    )
    user_id = flask_praetorian.current_user_id()
    new_club_admin = ClubAdmin(
        club_id=new_club.club_id,
        user_id=UUID(user_id)
    )
    db.session.add(new_club)
    db.session.add(new_club_admin)
    if save_teams:
        new_teams, new_team_names = club_scraper.get_teams(new_club.club_id)
    db.session.commit()
    return jsonify(success=True)