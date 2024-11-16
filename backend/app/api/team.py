import traceback
from uuid import UUID
from flask import Blueprint, jsonify
from app import db
from app.models.DataSource import DataSource
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.scrapers.teams.FootballAssociationTeamScraper import FootballAssociationTeamScraper
from app.types.enums import DataSource as DataSourceEnum

team_bp = Blueprint(
    name="team",
    url_prefix="/team",
    import_name=__name__
)

@team_bp.route("/get-seasons/<team_id>", methods=['GET'])
def get_seasons(team_id):
    try:
        team = db.session.query(Team) \
            .filter_by(team_id=UUID(team_id)) \
            .first()
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
        return jsonify(league_season_info_list), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    

@team_bp.route("/get/<team_id>", methods=['GET'])
def get_team(team_id):
    try:
        team = db.session.query(Team) \
            .filter_by(team_id=UUID(team_id)) \
            .first()
        return team.get_team_info(), 200
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@team_bp.route("/get-matches/<team_id>/<league_season_id>", methods=['GET'])
def get_team_matches(team_id, league_season_id):
    try:
        league_season = db.session.query(LeagueSeason) \
            .filter_by(league_season_id=UUID(league_season_id)) \
            .first()
        ## There's a chance this team_season doesn't exist yet
        team_season = db.session.query(TeamSeason) \
            .filter_by(team_id=UUID(team_id), league_season_id=UUID(league_season_id)) \
            .first()
        if (team_season is None):
            team = db.session.query(Team) \
                .filter_by(team_id=UUID(team_id)) \
                .first()
            team_season = TeamSeason(
                team_id=team_id,
                league_season_id=league_season_id
            )
        else:
            team = team_season.team
        if team.data_source_id == DataSourceEnum.FOOTBALL_ASSOCIATION:
            league_id = team.team_leagues[0].league_id
            league = db.session.query(League) \
                .filter_by(league_id=league_id) \
                .first()
            data_source = db.session.query(DataSource) \
                .filter_by(data_source_id=team.data_source_id) \
                .first()
            team_scraper = FootballAssociationTeamScraper(
                fa_team_id=team.data_source_team_id,
                fa_league_id=league.data_source_league_id,
                fa_base_url=data_source.url
            )
            new_matches, old_matches = team_scraper.get_team_matches(
                fa_season_id=league_season.data_source_league_season_id,
                team_names=team.get_team_name_str_list(),
                team_season_id=team_season.team_season_id
            )
            db.session.add_all(new_matches)
            db.session.delete(old_matches)
            db.session.commit()
            return jsonify(new_matches), 200
        else:
            raise Exception('Unexpected data source type')
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400