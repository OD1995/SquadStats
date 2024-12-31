from collections import OrderedDict
from typing import List
from uuid import UUID
from app.helpers.QueryBuilder import QueryBuilder
from app.helpers.validators import is_valid_uuid
from app.models.Club import Club
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.enums import QueryType
from app import db
from operator import itemgetter

class MatchesDataHandler:

    def __init__(
        self,
        query_type:str,
        club_id:str|None,
        team_id:str,
        season:str,
        opposition:str|None
    ):
        """
        query_type - should be one of QueryType options
        club_id - None (if focus is on team matches) or uuid
        team_id - '' or uuid
        season - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition - None or str (opposition_team_name)
        """
        self.query_type = query_type
        self.club_id = club_id
        self.team_id = team_id
        self.season = season
        self.opposition = opposition

        self.PPG = 'PPG'
        self.PLAYED = 'P'
        self.WINS = 'W'
        self.DRAWS = 'D'
        self.LOSSES = 'L'
        self.GOALS_FOR = 'F'
        self.GOALS_AGAINST = 'A'
        self.GOAL_DIFFERENCE = 'GD'

    def get_result(self):
        if self.query_type == QueryType.H2H:
            return self.get_h2h_result()
        raise Exception('Unexpected query type')
    
    def get_matches(self) -> List[Match]:
        matches_query = QueryBuilder(
            db.session.query(Match) \
                .join(TeamSeason) \
                .join(Team)
        )
        ## Team/Club filtering
        if self.team_id in [None, '']:
            matches_query.add_filter(Team.club_id == UUID(self.club_id))
        else:
            matches_query.add_filter(Team.team_id == UUID(self.team_id))
        ## Season filtering
        if self.season not in [None, '']:
            matches_query.add_join(LeagueSeason)
            if is_valid_uuid(self.season):
                matches_query.add_filter(LeagueSeason.league_id == UUID(self.season))
            else:
                matches_query.add_filter(LeagueSeason.data_source_season_name == self.season)
        if self.opposition not in [None, '']:
            matches_query.add_filter(Match.opposition_team_name == self.opposition)
        return matches_query.all()

    def create_aggregate_dict(
        self,
        team_name
    ):
        return OrderedDict({
            'Opposition' : team_name,
            self.PLAYED : 0,
            self.WINS : 0,
            self.DRAWS : 0,
            self.LOSSES : 0,
            self.GOALS_FOR : 0,
            self.GOALS_AGAINST : 0,
            self.GOAL_DIFFERENCE : 0,
            self.PPG : 0
        })
                    
    def get_h2h_result(self):
        matches = self.get_matches()
        aggregate_data = {}
        for match in matches:
            if match.opposition_team_name not in aggregate_data:
                aggregate_data[match.opposition_team_name] = self.create_aggregate_dict(match.opposition_team_name)
            # aggregate_data[match.opposition_team_name][self.PLAYED] += 1
            if match.goal_difference > 0:
                aggregate_data[match.opposition_team_name][self.WINS] += 1
            elif match.goal_difference == 0:
                aggregate_data[match.opposition_team_name][self.DRAWS] += 1
            else:
                aggregate_data[match.opposition_team_name][self.DRAWS] += 1
            aggregate_data[match.opposition_team_name][self.GOALS_FOR] += match.goals_for
            aggregate_data[match.opposition_team_name][self.GOALS_AGAINST] += match.goals_against
            aggregate_data[match.opposition_team_name][self.GOAL_DIFFERENCE] += match.goal_difference
        for oppo_name, dicto in aggregate_data.items():
            points = (dicto[self.WINS] * 3) + dicto[self.DRAWS]
            played = dicto[self.WINS] + dicto[self.DRAWS] + dicto[self.LOSSES]
            aggregate_data[oppo_name][self.PPG] = round(points / played, 2)
            aggregate_data[oppo_name][self.PLAYED] = played
        
        return [
            {
                'title' : 'H2H',
                'column_headers' : list(list(aggregate_data.values())[0].keys()),
                'rows' : [
                    list(dicto.values())
                    for dicto in sorted(list(aggregate_data.values()), key=itemgetter(self.PPG), reverse=True)
                ]
            }
        ]