from typing import List
from uuid import UUID
from xmlrpc.client import boolean

from sqlalchemy import func
from app.helpers.QueryBuilder import QueryBuilder
from app.helpers.misc import get_colour
from app.helpers.validators import is_valid_uuid
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import SplitByType
from app import db
from copy import deepcopy

class DataHandler:

    def __init__(self):    

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
            SplitByType.SEASON : self.SEASON,
            SplitByType.WITH_OR_WITHOUT : "",
            None : ""
        }
        # print(q.statement.compile(compile_kwargs={"literal_binds": True}))


    def get_complicated_player_performances(
        self,
        query_selectors=[],
        filters=[],
        order_by_list=[],
        group_by_list=[],
        havings=[],
        # sort_value_desc=True,
        limit=None,
        # split_by=None,
        return_all=True
    ):
        # query_selectors = [Player]
        # group_by_list = [Player]
        # if split_by is not None:
        #     query_selectors.append(split_by)
        #     group_by_list.append(split_by)
        # query_selectors.append(func.sum(PlayerMatchPerformance.value))
        # query = QueryBuilder(
        query = db.session.query(*query_selectors) \
            .join(Player) \
            .join(Match) \
            .join(TeamSeason) \
            .join(Metric) \
            .join(Team) \
            .join(LeagueSeason) \
            .filter(*filters) \
            .having(*havings) \
            .limit(limit) \
            .group_by(*group_by_list) \
            .order_by(*order_by_list)
        # )
        # for filter in filters:
        #     query.add_filter(filter)
        # query.limit(limit)
        if return_all:
            return query.all()
        return query.subquery()

    def get_player_performances(
        self,
        filters=[],
        sort_value_desc=True,
        limit=None,
        split_by=None,
        aggregator=func.sum
    ):
        query_selectors = [Player]
        group_by_list = [Player]
        if split_by is not None:
            query_selectors.append(split_by)
            group_by_list.append(split_by)
        # query_selectors.append(func.sum(PlayerMatchPerformance.value))
        query_selectors.append(aggregator(PlayerMatchPerformance.value))
        query = QueryBuilder(
            db.session.query(
                # Player,
                # func.sum(PlayerMatchPerformance.value)
                *query_selectors
            ) \
                .join(Player) \
                .join(Match) \
                .join(TeamSeason) \
                .join(Metric) \
                .join(Team) \
                .join(LeagueSeason) \
                .group_by(*group_by_list) \
                .order_by(
                    func.sum(PlayerMatchPerformance.value).desc() \
                        if sort_value_desc else \
                        func.sum(PlayerMatchPerformance.value).asc(),
                    Player.data_source_player_name
                )
        )
        for filter in filters:
            if filter is not None:
                query.add_filter(filter)
        query.limit(limit)
        return query.all()

    def get_matches(
        self,
        filters=[],
        limit:int=None,
        return_query:bool=False,
        order_bys=[Match.date.desc()],
        include_pmp_join=False
    ) -> List[Match]:
        matches_query = QueryBuilder(
            db.session.query(Match) \
                .join(TeamSeason) \
                .join(Team) \
                .join(LeagueSeason)
        )
        if include_pmp_join:
            matches_query.add_join(PlayerMatchPerformance)
        for filter in filters:
            if filter is not None:
                matches_query.add_filter(filter)
        matches_query.order_by(order_bys)
        matches_query.limit(limit)
        # matches_query = db.session.query(Match) \
        #     .join(TeamSeason) \
        #     .join(Team) \
        #     .join(LeagueSeason) \
        #     .filter(*filters) \
        #     .order_by(*order_bys) \
        #     .limit(limit)
        # if return_query:
        #     return matches_query
        # return matches_query.all()
        # for filter in filters:
        #     if filter is not None:
        #         matches_query.add_filter(filter)
        # matches_query.order_by(order_bys)
        # matches_query.limit(limit)
        if return_query:
            return matches_query.query
        return matches_query.all()
    
    def get_filters(self):
        # filters = []
        # ## Team/Club filtering
        # filters.extend(self.get_team_or_club_filter())
        # ## Season filtering
        # filters.append(self.get_season_filter())
        # ## Opposition filtering
        # filters.append(self.get_opposition_filter())
        # ## Player filtering
        # filters.append(self.get_player_filter())
        # return filters
        F = [
            ## Team/Club filtering
            self.get_team_or_club_filter(),
            ## Season filtering
            self.get_season_filter(),
            ## Opposition filtering
            self.get_opposition_filter(),
            ## Player filtering
            self.get_player_filter()
        ]
        filters = []
        for f in F:
            if (f is not None):
                if (isinstance(f, list)):
                    filters.extend(f)
                else:
                    filters.append(f)
        return filters
    def get_player_filter(self):
        if self.player_id_filter not in [None, '']:
            return PlayerMatchPerformance.player_id == UUID(self.player_id_filter)
        return None
    
    def get_opposition_filter(self):
        if self.opposition_filter not in [None, '']:
            return Match.opposition_team_name == self.opposition_filter
        return None

    
    def get_team_or_club_filter(self):
        filters = []
        if self.team_id in [None, '']:
            filters.append(Team.club_id == UUID(self.club_id))
        else:
            filters.append(Team.team_id == UUID(self.team_id))
        if self.team_id_filter is not None:
            filters.append(Team.team_id == UUID(self.team_id_filter))
        return filters
    
    def get_season_filter(self):
        if self.season_filter not in [None, '']:
            # matches_query.add_join(LeagueSeason)
            if is_valid_uuid(self.season_filter):
                return LeagueSeason.league_season_id == UUID(self.season_filter)
            else:
                return LeagueSeason.data_source_season_name == self.season_filter
        return None
    
    
    
    def get_split_by_table(
        self,
        matches:List[Match],
        split_by:str,
        is_table_ranked:bool,
        title:str|None=None,
        player_id:str|None=None
    ):
        aggregate_data = {}
        for match in matches:
            if match.goals_for is None:
                continue
            aggregate_data_key = match.get_agg_data_key(split_by, player_id)
            agg_row = aggregate_data.get(
                aggregate_data_key,
                self.create_aggregate_row(aggregate_data_key, split_by)
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
        title = title or f'SPLIT BY {split_by.upper()}'
        
        return GenericTableData(
            column_headers=self.get_split_by_cols(split_by),
            rows=sorted(
                list(aggregate_data.values()),
                key=lambda x: (x.get_cell_value(self.PPG), x.get_cell_value(self.GOAL_DIFFERENCE)),
                reverse=True
            ),
            title=title,
            is_ranked=is_table_ranked,
            sort_by=self.PPG,
            sort_direction='desc',
            not_sortable=len(aggregate_data) <= 2
        )

    def get_split_by_cols(
        self,
        split_by:str
    ):
        split_column = self.split_column_dict[split_by]
        return [split_column] + self.GENERIC_COLUMNS
    
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
    
    def create_aggregate_row(
        self,
        aggregate_data_key:str,
        split_by:str
    ):
        dicto = {
            cn : 0
            for cn in self.get_split_by_cols(split_by)
        }
        dicto[self.split_column_dict[split_by]] = aggregate_data_key
        return deepcopy(GenericTableRow(init=dicto))
    
    def create_player_cell(
        self,
        player:Player
    ):
        return GenericTableCell(
            value=player.get_best_name(),
            link=f"/player/{player.player_id}/overview"
        )