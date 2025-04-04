import asyncio
import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
import flask_praetorian
from app import db
from app.api import team
from app.data_handlers.MatchesFilterDataHandler import MatchesFilterDataHandler
from app.helpers.misc import do_error_handling
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Team import Team
from app.models.TeamLeague import TeamLeague
from app.models.TeamSeason import TeamSeason
from app.scrapers.clubs.FootballAssociationClubScraper import FootballAssociationClubScraper
from app.types.enums import DataSource as DataSourceEnum

season_bp = Blueprint(
    name="season",
    url_prefix="/season",
    import_name=__name__
)

@season_bp.route("/get-team-leagues-and-seasons/<team_id>", methods=['GET']) #
def get_team_seasons(team_id):
    try:
        matches_filter_data_handler = MatchesFilterDataHandler(
            club_id=None,
            team_id=team_id
        )
        return jsonify(matches_filter_data_handler.get_team_leagues_and_seasons())
    except Exception as e:
        return do_error_handling(e)
    
@season_bp.route("/get-club-seasons/<club_id>", methods=['GET'])
def get_club_seasons(club_id):
    try:
        matches_filter_data_handler = MatchesFilterDataHandler(
            club_id=club_id,
            team_id=None
        )
        return jsonify(matches_filter_data_handler.get_club_seasons())
    except Exception as e:
        return do_error_handling(e)

@season_bp.route("/update-seasons", methods=['POST'])
@flask_praetorian.auth_required
def update_seasons():
    try:
        req = request.get_json(force=True)
        team_id = req.get("teamId")
        team = db.session.query(Team) \
            .filter_by(team_id=UUID(team_id)) \
            .first()
        data_source_id = team.data_source.data_source_id
        new_leagues = {
            tm_lg.league.data_source_league_id : tm_lg.league
            for tm_lg in team.team_leagues
        }
        match data_source_id:
            case DataSourceEnum.FOOTBALL_ASSOCIATION.value:
                league_scraper = FootballAssociationClubScraper(
                    fa_club_id=team.club.data_source_club_id,
                    fa_base_url=team.data_source.url
                )
        league_seasons_dict = asyncio.run(
            league_scraper.get_league_seasons(
                new_leagues=new_leagues
            )
        )
        current_league_seasons = db.session.query(LeagueSeason) \
            .join(League) \
            .join(TeamLeague) \
            .filter(TeamLeague.team_id == UUID(team_id)) \
            .all()
        league_seasons_by_data_source_id = {}
        still_exists = {}
        league_seasons_to_add = []
        league_seasons_to_delete = []
        for ls in current_league_seasons:
            league_seasons_by_data_source_id[ls.data_source_league_season_id] = ls
            still_exists[ls.data_source_league_season_id] = False
        for data_source_league_id, league_season_list in league_seasons_dict.items():
            for lg_season in league_season_list:
                if lg_season.data_source_league_season_id in league_seasons_by_data_source_id:
                    still_exists[lg_season.data_source_league_season_id] = True
                    ls = league_seasons_by_data_source_id[lg_season.data_source_league_season_id]
                    ls.league_id = lg_season.league_id
                    ls.data_source_season_name = lg_season.data_source_season_name
                else:
                    league_seasons_to_add.append(lg_season)
        for data_source_league_season_id, does_still_exist in still_exists.items():
            if not does_still_exist:
                league_seasons_to_delete.append(
                    league_seasons_by_data_source_id[data_source_league_season_id]
                )
        db.session.add_all(league_seasons_to_add)
        for lg_ssn in league_seasons_to_delete:
            db.session.delete(lg_ssn)
        db.session.commit()
        league_ids = [
            tl.league_id
            for tl in team.team_leagues
        ]
        league_seasons = db.session.query(LeagueSeason) \
            .join(League) \
            .filter(League.league_id.in_(league_ids)) \
            .order_by(LeagueSeason.data_source_season_name.desc()) \
            .all()
        league_season_info_list = [
            x.get_league_season_info()
            for x in league_seasons
        ]
        return jsonify(league_season_info_list)
    except Exception as e:
        return do_error_handling(e)
    
@season_bp.route("/create-new-league-and-season", methods=['POST'])
@flask_praetorian.auth_required
def create_new_league_and_season():
    try:
        req = request.get_json(force=True)
        league_name = req.get('leagueName')
        season_name = req.get('seasonName')
        team_id = UUID(req.get('teamId'))
        new_league = League(
            league_name=league_name,
            data_source_league_id=None,
            data_source_id=None
        )
        new_team_league = TeamLeague(
            team_id=team_id,
            league_id=new_league.league_id
        )
        new_league_season = LeagueSeason(
            league_id=new_league.league_id,
            data_source_season_name=season_name,
            data_source_league_season_id=None
        )
        new_team_season = TeamSeason(
            team_id=team_id,
            league_season_id=new_league_season.league_season_id
        )
        db.session.add(new_league)
        db.session.add(new_team_league)
        db.session.add(new_league_season)
        db.session.add(new_team_season)
        db.session.commit()
        return jsonify({
            "league_season_id" : new_league_season.league_season_id
        })
    except Exception as e:
        return do_error_handling(e)

@season_bp.route("/create-new-season", methods=['POST'])
@flask_praetorian.auth_required
def create_new_season():
    try:
        req = request.get_json(force=True)
        league_id = req.get('leagueId')
        season_name = req.get('seasonName')
        team_id = UUID(req.get('teamId'))
        league = db.session.query(League) \
            .filter_by(league_id=UUID(league_id)) \
            .first()
        new_league_season = LeagueSeason(
            league_id=league.league_id,
            data_source_season_name=season_name,
            data_source_league_season_id=None
        )
        new_team_season = TeamSeason(
            team_id=team_id,
            league_season_id=new_league_season.league_season_id
        )
        db.session.add(new_league_season)
        db.session.add(new_team_season)
        db.session.commit()
        return jsonify({
            "league_season_id" : new_league_season.league_season_id
        })
    except Exception as e:
        return do_error_handling(e)