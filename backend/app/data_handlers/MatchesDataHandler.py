from typing import List
from uuid import UUID
from app.helpers.QueryBuilder import QueryBuilder
from app.helpers.misc import get_colour
from app.helpers.validators import is_valid_uuid
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import SplitByType
from app import db
from copy import deepcopy

class MatchesDataHandler:

    def __init__(
        self,
        split_by:str,
        club_id:str|None,
        team_id:str|None,
        season:str,
        opposition:str|None,
        team_id_filter:str|None
    ):
        """
        split_by - should be one of SplitByType options
        club_id - None (if focus is on team matches) or uuid
        team_id - None (if focus is on club matches) or uuid
        season - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition - None or str (opposition_team_name)
        team_id_filter - '' or uuid
        """
        self.split_by = split_by
        self.club_id = club_id
        self.team_id = team_id
        self.season = season
        self.opposition = opposition
        self.team_id_filter = team_id_filter

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
        self.SEASON = 'Season'

        self.GENERIC_COLUMNS = [
            self.PLAYED,
            self.WINS,
            self.DRAWS,
            self.LOSSES,
            self.GOALS_FOR,
            self.GOALS_AGAINST,
            self.GOAL_DIFFERENCE,
            self.PPG
        ]

        self.split_column_dict = {
            SplitByType.OPPOSITION : self.OPPO,
            SplitByType.PLAYER_COUNT : self.PLAYER_COUNT,
            SplitByType.SEASON : self.SEASON
        }


    def get_result(self):
        if self.split_by == SplitByType.NA:
            return self.get_all_matches_result()
        if self.split_by in [
            SplitByType.OPPOSITION,
            SplitByType.PLAYER_COUNT,
            SplitByType.SEASON
        ]:
            return self.get_split_by_result()
        raise Exception('Unexpected split by type')
    

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
        if self.team_id_filter is not None:
            matches_query.add_filter(Team.team_id == UUID(self.team_id_filter))
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
    

    def get_all_matches_result(self):
        matches = self.get_matches()
        return [
            self.get_matches_table(matches).to_dict()
        ]
    

    def get_split_by_result(self):
        matches = self.get_matches()
        aggregate_data = {}
        for match in matches:
            if match.goals_for is None:
                continue
            aggregate_data_key = match.get_agg_data_key(self.split_by)
            agg_row = aggregate_data.get(
                aggregate_data_key,
                self.create_aggregate_row(aggregate_data_key)
            )
            agg_row = self.increment_match_values(
                match=match,
                agg_row=agg_row
            )
            aggregate_data[aggregate_data_key] = agg_row
        for key in aggregate_data.keys():
            agg_row = aggregate_data[key]
            res = self.calculate_aggregate_info(agg_row)
            for c in [self.PPG, self.PLAYED]:
                agg_row.set_cell_value(c, res[c])
            aggregate_data[key] = agg_row
            agg_row.add_to_cell_styles(
                column_name=self.PPG,
                property='backgroundColor',
                value=get_colour(
                    red_to_green=agg_row.get_cell_value(self.PPG) / 3.0
                )
            )
        
        oppo_filter_exists = self.opposition not in [None, '']
        is_table_ranked = True
        double_oppo = (self.split_by == SplitByType.OPPOSITION) & oppo_filter_exists
        double_season = (self.split_by == SplitByType.SEASON) & (self.season not in [None, ''])
        if double_oppo | double_season:
            is_table_ranked = False
        return_me = [
            GenericTableData(
                column_headers=self.get_split_by_cols(),
                rows=sorted(
                    list(aggregate_data.values()),
                    key=lambda x: (x.get_cell_value(self.PPG), x.get_cell_value(self.GOAL_DIFFERENCE)),
                    reverse=True
                ),
                title=f'SPLIT BY {self.split_by.upper()}',
                is_ranked=is_table_ranked,
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
    

    def get_split_by_cols(self):
        split_column = self.split_column_dict[self.split_by]
        return [split_column] + self.GENERIC_COLUMNS


    def create_aggregate_row(
        self,
        aggregate_data_key:str
    ):
        dicto = {
            cn : 0
            for cn in self.get_split_by_cols()
        }
        dicto[self.split_column_dict[self.split_by]] = aggregate_data_key
        return deepcopy(GenericTableRow(init=dicto))
        

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
            title='MATCHES'
        )

    
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