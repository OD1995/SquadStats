import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
from app import db
from app.models.DataSource import DataSource
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.MatchError import MatchError
from app.models.Team import Team
from app.models.TeamName import TeamName
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
                team_id=UUID(team_id),
                league_season_id=UUID(league_season_id)
            )
            db.session.add(team_season)
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
            new_matches, new_match_errors, new_competitions = team_scraper.get_team_matches(
                fa_season_id=league_season.data_source_league_season_id,
                team_names=team.get_team_name_str_list(),
                team_season_id=team_season.team_season_id
            )
            ## Delete old matches/scraping errors from relevant matches
            db.session.query(MatchError) \
                .filter(
                    MatchError.match_id == Match.match_id,
                    Match.team_season_id == team_season.team_season_id
                ).delete()
            db.session.query(Match) \
                .filter_by(team_season_id=team_season.team_season_id) \
                .delete()
            db.session.add_all(new_matches)
            db.session.add_all(new_match_errors)
            db.session.add_all(new_competitions)
            db.session.commit()
            return jsonify([
                match.to_dict()
                for match in sorted(new_matches, key=lambda x: x.date)
            ])
        else:
            raise Exception('Unexpected data source type')
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@team_bp.route("/get-team-names/<team_id>", methods=['GET'])
def get_team_names(team_id):
    try:
        team_names = db.session.query(TeamName) \
            .filter_by(team_id=UUID(team_id)) \
            .order_by(TeamName.is_default_name.desc()) \
            .all()
        return jsonify(team_names)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400

@team_bp.route("/save-team-names", methods=['POST'])
def save_team_names():
    try:
        req = request.get_json(force=True)
        for team_name_dict in req:
            team_name = TeamName(
                team_name_id=UUID(team_name_dict['team_name_id']) \
                    if 'team_name_id' in team_name_dict else None,
                team_id=UUID(team_name_dict['team_id']),
                team_name=team_name_dict['team_name'],
                is_default_name=team_name_dict['is_default_name']
            )
            db.session.merge(team_name)
        db.session.commit()
        return jsonify(success=True)
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400