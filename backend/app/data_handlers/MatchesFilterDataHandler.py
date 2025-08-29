from datetime import date
from uuid import UUID

from sqlalchemy import extract
from app import db
from operator import itemgetter

from app.helpers.QueryBuilder import QueryBuilder
from app.models.Club import Club
from app.models.League import League
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.enums import DataSource

class MatchesFilterDataHandler:

    def __init__(
        self,
        club_id:str|None,
        team_id:str|None,
        is_players:str=False
    ):
        self.club_id = club_id if club_id != 'undefined' else None
        self.team_id = team_id if team_id != 'undefined' else None
        self.team = None
        if self.team_id is not None:
            self.team = db.session.query(Team) \
                        .filter_by(team_id=UUID(self.team_id)) \
                        .first()
        self.is_players = True if is_players == 'True' else False

    def get_data(self):               
        return {
            'club_seasons' : self.get_club_seasons(),
            'team_seasons' : self.get_team_seasons(self.team),
            'oppositions' : self.get_oppositions(),
            'players' : self.get_players(),
            'years' : self.get_date_options('year'),
            'months' : self.get_date_options('month'),
        }
    
    def get_date_options(self, date_type):
        query = QueryBuilder(
            db.session.query(extract(date_type, Match.date).label(date_type)) \
            .join(TeamSeason) \
            .join(Team) \
            .distinct() \
            .order_by(date_type)
        )
        if self.club_id is not None:
            query.add_join(Club)
            query.add_filter(Club.club_id == UUID(self.club_id))
        else:
            query.add_filter(Team.team_id == UUID(self.team_id))
        return [
            str(row[0]) if date_type == 'year' else date(month=row[0],year=1,day=1).strftime("%b")
            for row in query.all()
        ]
    
    # def get_years(self):
    #     years_query = QueryBuilder(
    #         db.session.query(extract("year", Match.date).label('year')) \
    #         .join(TeamSeason) \
    #         .join(Team) \
    #         .distinct() \
    #         .order_by("year")
    #     )
    #     if self.club_id is not None:
    #         years_query.join(Club)
    #         years_query.add_filter(Club.club_id == UUID(self.club_id))
    #     else:
    #         years_query.add_filter(Team.team_id == UUID(self.team_id))
    #     return [
    #         str(row[0])
    #         for row in years_query.all()
    #     ]

    def get_players(self):
        players_query = QueryBuilder(
            db.session.query(Player) \
            .join(PlayerMatchPerformance) \
            .join(Match) \
            .join(TeamSeason) \
            .join(Team)
        )
        if self.club_id is not None:
            players_query.add_join(Club)
            players_query.add_filter(Club.club_id == UUID(self.club_id))
        else:
            players_query.add_filter(Team.team_id == UUID(self.team_id))
        return [
            p.to_dict()
            for p in sorted(players_query.all(), key=lambda x: x.get_best_name())
        ]

    def get_club_seasons(self):
        if self.club_id is None:
            return []
        club = db.session.query(Club) \
            .filter_by(club_id=UUID(self.club_id)) \
            .first()
        result = {}
        unique_season_names = {}
        for team in club.teams:
            team_seasons = self.get_team_seasons(team)
            result[str(team.team_id)] = team_seasons
            for ts in team_seasons:
                unique_season_names[ts['season_name']] = {
                    'season_id' : ts['season_name'],
                    'season_name' : ts['season_name']
                }
        string_season_names = []
        int_season_names = []
        for season in unique_season_names.values():
            if isinstance(season['season_name'], int):
                int_season_names.append(season)
            else:
                string_season_names.append(season)
        result[''] = sorted(
            string_season_names,
            key=itemgetter('season_name'),
        ) + sorted(
            int_season_names,
            key=itemgetter('season_name'),
        )
        return result
    
    def get_team_seasons(self, team:Team|None):
        if team is None:
            return []
        team_seasons = [
            ts.league_season.get_league_season_info()
            for ts in team.team_seasons
        ]
        return sorted(
            team_seasons,
            key=lambda x: x['season_name']
        )
    
    def get_team_leagues_and_seasons(self):
        if self.team_id is None:
            return {
                'leagues' : {},
                'seasons' : []
            }
        # leagues = {
        #     str(tl.league_id) : tl.league.get_league_info(include_team_season=True)
        #     for tl in team.team_leagues
        # }
        leagues = {}
        team_leagues = self.team.team_leagues
        for tl in team_leagues:
            lg = tl.league
            leagues[str(tl.league_id)] = lg.get_league_info(include_team_season=True)

        seasons = [] \
            if self.team.data_source.data_source_id == DataSource.MANUAL else \
            [
                lg_ssn.get_league_season_info(include_team_season=True)
                for tm_lg in self.team.team_leagues
                for lg_ssn in tm_lg.league.league_seasons
            ]
        return {
            'leagues' : leagues,
            'seasons' : seasons
        }
    
    def get_oppositions(self):
        matches_query = db.session.query(Match.opposition_team_name.distinct()) \
            .join(TeamSeason) \
            .join(Team) \
            .order_by(Match.opposition_team_name.asc())
        if self.club_id is not None:
            matches_query = matches_query \
                .join(Club) \
                .filter(Club.club_id == UUID(self.club_id))
        else:
            matches_query = matches_query \
                .filter(Team.team_id == UUID(self.team_id))
        return [
            row[0]
            for row in matches_query.all()
        ]