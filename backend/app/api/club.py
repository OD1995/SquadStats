import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
import flask_praetorian
from app import db
from app.data_handlers.ClubOverview import ClubOverview
from app.helpers.validators import get_club_id_from_shared_club_id
from app.models.Club import Club
from app.models.ClubAdmin import ClubAdmin
from app.models.DataSource import DataSource
from app.models.Player import Player
from app.scrapers.clubs.FootballAssociationClubScraper import FootballAssociationClubScraper
from app.types.enums import ClubType, DataSource as DataSourceEnum

club_bp = Blueprint(
    name="club",
    url_prefix="/club",
    import_name=__name__
)

@club_bp.route("/get/<club_id>", methods=['GET']) #
def get_club(club_id):
    try:
        club = db.session.query(Club).filter_by(club_id=UUID(club_id)).first()
        return club.get_club_info(), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400


@club_bp.route("/create", methods=['POST'])
@flask_praetorian.auth_required
def create_club():
    try:
        save_teams = False
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
            club_count = db.session.query(Club).filter_by(club_id=actual_club_id).count()
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
            DataSourceEnum.FOOTBALL_ASSOCIATION.value
        ]:
            base_url = db.session.query(DataSource).filter_by(
                data_source_id=DataSourceEnum.FOOTBALL_ASSOCIATION
            ).first().url
            match data_source:
                case DataSourceEnum.FOOTBALL_ASSOCIATION.value:
                    club_scraper = FootballAssociationClubScraper(
                        fa_club_id=club_id,
                        fa_base_url=base_url
                    )
                    save_teams = True
            club_name = club_scraper.get_club_name()
        elif data_source == DataSourceEnum.MANUAL.value:
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
        db.session.commit()
        if save_teams:
            (
                new_teams,
                new_team_names,
                new_team_leagues,
                new_leagues,
                new_league_seasons
            ) = club_scraper.get_teams(new_club.club_id)
            db.session.add_all(new_teams)
            # db.session.commit()
            db.session.add_all(new_team_names)
            db.session.add_all(new_leagues)
            db.session.add_all(new_team_leagues)
            db.session.add_all(new_league_seasons)
            db.session.commit()
        current_user = flask_praetorian.current_user()
        return {
            **current_user.get_ss_user_data(),
            **{"new_club_id" : new_club.club_id}
        }, 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@club_bp.route("/get-club-overview-stats/<club_id>", methods=['GET']) #
def get_club_overview_stats(club_id):
    try:
        club_overview = ClubOverview(club_id=club_id)
        club_overview_data = club_overview.get_data()
        return jsonify(club_overview_data)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@club_bp.route("/get-player-information/<club_id>", methods=['GET']) #
def get_player_information(club_id):
    try:
        players = db.session.query(Player) \
            .filter(Player.club_id == UUID(club_id)) \
            .all()
        club = db.session.query(Club) \
            .filter(Club.club_id == UUID(club_id)) \
            .first()
        return jsonify(
            {
                'club_name' : club.club_name,
                'players' : [
                    p.to_dict()
                    for p in sorted(players, key=lambda x: x.get_best_name())
                ]
            }
        )
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
    