from typing import List
from uuid import UUID

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

        self.split_column_dict = {
            SplitByType.OPPOSITION : self.OPPO,
            SplitByType.PLAYER_COUNT : self.PLAYER_COUNT,
            SplitByType.SEASON : self.SEASON
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
        split_by=None
    ):
        query_selectors = [Player]
        group_by_list = [Player]
        if split_by is not None:
            query_selectors.append(split_by)
            group_by_list.append(split_by)
        query_selectors.append(func.sum(PlayerMatchPerformance.value))
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
        order_bys=[Match.date.desc()]
    ) -> List[Match]:
        matches_query = QueryBuilder(
            db.session.query(Match) \
                .join(TeamSeason) \
                .join(Team) \
                .join(LeagueSeason)
        )
        for filter in filters:
            if filter is not None:
                matches_query.add_filter(filter)
        matches_query.order_by(order_bys)
        matches_query.limit(limit)
        if return_query:
            return matches_query.query
        return matches_query.all()
    
    def get_filters(self):
        filters = []
        ## Team/Club filtering
        filters.extend(self.get_team_or_club_filter())
        ## Season filtering
        filters.append(self.get_season_filter())
        ## Opposition filtering
        filters.append(self.get_opposition_filter())
        return filters
    
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