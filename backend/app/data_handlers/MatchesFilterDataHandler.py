from uuid import UUID
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

class MatchesFilterDataHandler:

    def __init__(
        self,
        club_id:str|None,
        team_id:str|None,
        is_players:str=False
    ):
        self.club_id = club_id if club_id != 'undefined' else None
        self.team_id = team_id if team_id != 'undefined' else None
        self.is_players = True if is_players == 'True' else False

    def get_data(self):        
        return {
            'club_seasons' : self.get_club_seasons(),
            'team_seasons' : self.get_team_seasons(),
            'oppositions' : self.get_oppositions(),
            'players' : self.get_players()
        }
    
    def get_players(self):
        if self.is_players:
            return []
        players_query = QueryBuilder(
            db.session.query(Player) \
            .join(PlayerMatchPerformance) \
            .join(Match) \
            .join(TeamSeason) \
            .join(Team)
        )
        if self.club_id is not None:
            players_query.add_filter(Club.club_id == UUID(self.club_id))
                # .filter()
        else:
            players_query.add_filter(Team.team_id == UUID(self.team_id))
            # players_query = players_query \
            #     .filter(Team.team_id == UUID(self.team_id))
        A = players_query.all()
        return [
            p.to_dict()
            for p in sorted(A, key=lambda x: x.get_best_name())
        ]

    def get_club_seasons(self):
        if self.club_id is None:
            return []
        club = db.session.query(Club) \
            .filter_by(club_id=UUID(self.club_id)) \
            .first()
        league_ids = []
        team_ids = []
        for team in club.teams:
            for tl in team.team_leagues:
                league_ids.append(tl.league_id)
            team_ids.append(team.team_id)
        league_seasons = db.session.query(LeagueSeason) \
            .join(League) \
            .filter(League.league_id.in_(league_ids)) \
            .order_by(LeagueSeason.data_source_season_name.desc()) \
            .all()
        result = {}
        distinct_season_names = {
            ls.data_source_season_name : {
                'season_name' : ls.data_source_season_name,
                'season_id' : ls.data_source_season_name
            }
            for ls in league_seasons
        }
        for team_id in team_ids:
            ls_info_list = []
            for ls in league_seasons:
                for team_lg in ls.league.team_leagues:
                    if team_id == team_lg.team_id:
                        ls_info_list.append(ls.get_league_season_info())
            result[str(team_id)] = ls_info_list
        result[''] = sorted(list(
            distinct_season_names.values()),
            key=itemgetter('season_name'),
            reverse=True
        )
        return result
    
    def get_team_leagues_and_seasons(self):
        if self.team_id is None:
            return {
                'leagues' : [],
                'seasons' : []
            }
        team = db.session.query(Team) \
            .filter_by(team_id=UUID(self.team_id)) \
            .first()
        leagues = [
            tl.league.get_league_info()
            for tl in team.team_leagues
        ]
        seasons = [
            ts.league_season.get_league_season_info()
            for ts in team.team_seasons
        ]
        return {
            'leagues' : leagues,
            'seasons' : seasons
        }
        # league_ids = [
        #     tl.league_id
        #     for tl in team.team_leagues
        # ]
        # league_seasons = db.session.query(LeagueSeason) \
        #     .join(League) \
        #     .filter(League.league_id.in_(league_ids)) \
        #     .order_by(LeagueSeason.data_source_season_name.desc()) \
        #     .all()
        # leagues = {}
        # seasons = []
        # for ls in league_seasons:
        #     leagues[ls.league_id] = ls.league.get_league_info()
        #     seasons.append(ls.get_league_season_info())
        # return {
        #     'leagues' : list(leagues.values()),
        #     'seasons' : seasons
        # }
    
    def get_oppositions(self):
        matches_query = db.session.query(Match.opposition_team_name.distinct()) \
            .join(TeamSeason) \
            .join(Team) \
            .order_by(Match.opposition_team_name.asc())
        if self.club_id is not None:
            matches_query = matches_query \
                .filter(Club.club_id == UUID(self.club_id))
        else:
            matches_query = matches_query \
                .filter(Team.team_id == UUID(self.team_id))
        return [
            row[0]
            for row in matches_query.all()
        ]