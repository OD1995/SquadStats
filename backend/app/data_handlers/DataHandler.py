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
        pass

    def get_player_performances(
        self,
        filters=[],
        sort_value_desc=True,
        limit=None
    ):
        query = QueryBuilder(
            db.session.query(
                Player,
                func.sum(PlayerMatchPerformance.value)
            ) \
                .join(Player) \
                .join(Match) \
                .join(TeamSeason) \
                .join(Metric) \
                .join(Team) \
                .group_by(Player) \
                .order_by(
                    func.sum(PlayerMatchPerformance.value).desc() \
                        if sort_value_desc else \
                        func.sum(PlayerMatchPerformance.value).asc(),
                    Player.data_source_player_name
                )
        )
        for filter in filters:
            query.add_filter(filter)
        query.limit(limit)
        return query.all()

    def get_matches(
        self,
        # team_id:str|None=None,
        # club_id:str|None=None,
        # team_id_filter:str|None=None,
        # season:str|None=None,
        # opposition:str|None=None,
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
        # ## Team/Club filtering
        # if team_id in [None, '']:
        #     matches_query.add_filter(Team.club_id == UUID(club_id))
        # else:
        #     matches_query.add_filter(Team.team_id == UUID(team_id))
        # if team_id_filter is not None:
        #     matches_query.add_filter(Team.team_id == UUID(team_id_filter))
        # ## Season filtering
        # if season not in [None, '']:
        #     matches_query.add_join(LeagueSeason)
        #     if is_valid_uuid(season):
        #         matches_query.add_filter(LeagueSeason.league_season_id == UUID(season))
        #     else:
        #         matches_query.add_filter(LeagueSeason.data_source_season_name == season)
        # if opposition not in [None, '']:
        #     matches_query.add_filter(Match.opposition_team_name == opposition)
        for filter in filters:
            matches_query.add_filter(filter)
        matches_query.order_by(order_bys)
        matches_query.limit(limit)
        if return_query:
            return matches_query.query
        return matches_query.all()