from typing import List
from uuid import UUID
from app.helpers.QueryBuilder import QueryBuilder
from app.helpers.misc import get_colour
from app.helpers.validators import is_valid_uuid
from app.models.Club import Club
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import QueryType
from app import db
from copy import deepcopy

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

        self.OPPO = 'Opposition'
        self.PPG = 'PPG'
        self.PLAYED = 'P'
        self.WINS = 'W'
        self.DRAWS = 'D'
        self.LOSSES = 'L'
        self.GOALS_FOR = 'F'
        self.GOALS_AGAINST = 'A'
        self.GOAL_DIFFERENCE = 'GD'
        self.PLAYER_COUNT = 'Player Count'

        self.H2H_COLS = [
            self.OPPO,
            self.PLAYED,
            self.WINS,
            self.DRAWS,
            self.LOSSES,
            self.GOALS_FOR,
            self.GOALS_AGAINST,
            self.GOAL_DIFFERENCE,
            self.PPG
        ]

        self.PPG_BY_PLAYER_COUNT_COLS = [
            self.PLAYER_COUNT,
            self.PPG,
            self.PLAYED,
            self.WINS,
            self.DRAWS,
            self.LOSSES,
            self.GOALS_FOR,
            self.GOALS_AGAINST,
            self.GOAL_DIFFERENCE,
        ]

    def get_result(self):
        if self.query_type == QueryType.MATCH_HISTORY:
            return self.get_match_history_result()
        if self.query_type == QueryType.H2H:
            return self.get_h2h_result()
        if self.query_type == QueryType.PPG_BY_PLAYER_COUNT:
            return self.get_ppg_by_player_count_result()
        raise Exception('Unexpected query type')
    
    def get_matches(self) -> List[Match]:
        matches_query = QueryBuilder(
            db.session.query(Match) \
                .join(TeamSeason) \
                .join(Team) \
                .order_by(Match.date)
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
    
    def get_match_history_result(self):
        matches = self.get_matches()
        return [
            self.get_matches_table(matches).to_dict()
        ]
    
    def get_ppg_by_player_count_result(self):
        matches = self.get_matches()
        aggregate_data = {}
        for match in matches:
            if match.goals_for is None:
                continue
            player_count = match.get_player_count()
            agg_row = aggregate_data.get(
                player_count,
                self.create_ppg_by_player_count_aggregate_row(player_count)
            )
            agg_row = self.increment_match_values(
                match=match,
                agg_row=agg_row
            )
            aggregate_data[player_count] = agg_row
        for player_count in aggregate_data.keys():
            agg_row = aggregate_data[player_count]
            res = self.calculate_aggregate_info(agg_row)
            for c in [self.PPG, self.PLAYED]:
                agg_row.set_cell_value(c, res[c])
            agg_row.add_to_cell_styles(
                column_name=self.PPG,
                property='backgroundColor',
                value=get_colour(
                    red_to_green=agg_row.get_cell_value(self.PPG) / 3.0
                )
            )
            aggregate_data[player_count] = agg_row
        return [
            GenericTableData(
                column_headers=self.PPG_BY_PLAYER_COUNT_COLS,
                rows=sorted(
                    list(aggregate_data.values()),
                    key=lambda x: x.get_cell_value(self.PLAYER_COUNT),
                    reverse=True
                ),
                title='PPG By Player Counts'.upper(),
                not_sortable=False,
                sort_by=self.PLAYER_COUNT,
                sort_direction='asc'
            ).to_dict()
        ]

    def create_ppg_by_player_count_aggregate_row(
        self,
        player_count:int
    ):
        dicto = {
            cn : 0
            for cn in self.PPG_BY_PLAYER_COUNT_COLS
        }
        dicto[self.PLAYER_COUNT] = player_count
        return deepcopy(GenericTableRow(init=dicto))      
                        
    def get_h2h_result(self):
        matches = self.get_matches()
        oppo_filter_exists = self.opposition not in [None, '']
        aggregate_data = {}
        for match in matches:
            if match.goals_for is None:
                continue
            agg_row = aggregate_data.get(
                match.opposition_team_name,
                self.create_h2h_aggregate_row(match.opposition_team_name)
            )
            agg_row = self.increment_match_values(
                match=match,
                agg_row=agg_row
            )
            aggregate_data[match.opposition_team_name] = agg_row
        for oppo_name in aggregate_data.keys():
            agg_row = aggregate_data[oppo_name]
            res = self.calculate_aggregate_info(agg_row)
            for c in [self.PPG, self.PLAYED]:
                agg_row.set_cell_value(c, res[c])
            aggregate_data[oppo_name] = agg_row
        
        return_me = [
            GenericTableData(
                column_headers=self.H2H_COLS,
                rows=sorted(
                    list(aggregate_data.values()),
                    key=lambda x: (x.get_cell_value(self.PPG), x.get_cell_value(self.GOAL_DIFFERENCE)),
                    reverse=True
                ),
                title='H2H',
                is_ranked=not oppo_filter_exists,
                sort_by=self.PPG,
                sort_direction='desc'
            )
        ]

        if oppo_filter_exists:
            return_me.append(self.get_matches_table(matches))

        return [
            r.to_dict()
            for r in return_me
        ]
    
    def get_matches_table(
        self,
        matches:List[Match]
    ):
        headers = [
            'Opposition',
            'Result',
            'Date'
        ]
        return GenericTableData(
            column_headers=headers,
            rows=[
                m.get_short_table_row(format_score=True)
                for m in matches
            ],
            title='Matches'.upper()
        )

    def create_h2h_aggregate_row(
        self,
        team_name
    ):
        dicto = {
            cn : 0
            for cn in self.H2H_COLS
        }
        dicto[self.OPPO] = team_name
        return deepcopy(GenericTableRow(init=dicto))
    
    def increment_match_values(
        self,
        match:Match,
        agg_row:GenericTableRow
    ):
        increments = [
            (self.GOALS_FOR, match.goals_for),
            (self.GOALS_AGAINST, match.goals_against),
            (self.GOAL_DIFFERENCE, match.goal_difference)
        ]
        if match.goal_difference > 0:
            increments.append((self.WINS, 1))
        elif match.goal_difference == 0:
            increments.append((self.DRAWS, 1))
        else:
            increments.append((self.LOSSES, 1))
        for cn, inc in increments:
            agg_row.increment_cell_value(
                column_name=cn,
                increment=inc
            )
        return agg_row
    
    def calculate_aggregate_info(
        self,
        agg_row:GenericTableRow
    ):
        result = {}
        wins = agg_row.get_cell_value(self.WINS)
        draws = agg_row.get_cell_value(self.DRAWS)
        losses = agg_row.get_cell_value(self.LOSSES)
        points = (wins * 3) + draws
        played = wins + draws + losses
        result[self.PLAYED] = played
        ppg = round(points / played, 2)
        result[self.PPG] = ppg
        return result