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

class AnalysisDataHandler:

    def __init__(
        self,
        club_id:str|None,
        team_id:str|None,
        season:str,
        opposition:str|None,
        team_id_filter:str|None
    ):
        self.club_id = club_id
        self.team_id = team_id
        self.season = season
        self.opposition = opposition
        self.team_id_filter = team_id_filter

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
                matches_query.add_filter(LeagueSeason.league_season_id == UUID(self.season))
            else:
                matches_query.add_filter(LeagueSeason.data_source_season_name == self.season)
        if self.opposition not in [None, '']:
            matches_query.add_filter(Match.opposition_team_name == self.opposition)
        return matches_query.all()