from typing import List

from app.data_handlers.DataHandler import DataHandler
from app.models.Match import Match
from app.types.GenericTableData import GenericTableData
from app.types.enums import SplitByType

class MatchesDataHandler(DataHandler):

    def __init__(
        self,
        split_by:str,
        club_id:str|None,
        team_id:str|None,
        season_filter:str|None,
        opposition_filter:str|None,
        team_id_filter:str|None,
        player_id_filter:str|None,
        year_filter:str|None,
        month_filter:str|None,
    ):
        """
        split_by - should be one of SplitByType options
        club_id - None (if focus is on team matches) or uuid
        team_id - None (if focus is on club matches) or uuid
        season_filter - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition_filter - None or str (opposition_team_name)
        team_id_filter - '' or uuid
        player_id_filter - '' or uuid
        year_filter = None or int
        month_filter = None or str
        """
        DataHandler.__init__(self)
        self.split_by = split_by
        self.club_id = club_id
        self.team_id = team_id
        self.season_filter = season_filter
        self.opposition_filter = opposition_filter
        self.team_id_filter = team_id_filter
        self.player_id_filter = player_id_filter
        self.year_filter = year_filter
        self.month_filter = month_filter

    def get_result(self):
        if self.split_by == SplitByType.NA:
            return self.get_all_matches_result()
        if self.split_by in [
            SplitByType.TOTAL,
            SplitByType.OPPOSITION,
            SplitByType.PLAYER_COUNT,
            SplitByType.SEASON,
            SplitByType.MONTH,
            SplitByType.YEAR,
            SplitByType.KO_TIME,
            SplitByType.MONTH_AND_YEAR,
        ]:
            return self.get_split_by_result(
                matches=self._get_matches()
            )
        raise Exception('Unexpected split by type')

    def _get_matches(self):
        return self.get_matches(
            filters=self.get_filters(),
            include_pmp_join=self.player_id_filter not in [None, '']
        )
    
    def get_all_matches_result(self):
        matches = self._get_matches()
        return [
            self.get_matches_table(matches).to_dict()
        ]

    def get_split_by_result(
        self,
        matches:List[Match]
    ):
        oppo_filter_exists = self.opposition_filter not in [None, '']
        month_filter_exists = self.month_filter not in [None, '']
        year_filter_exists = self.year_filter not in [None, '']
        is_table_ranked = True
        double_oppo = (self.split_by == SplitByType.OPPOSITION) & oppo_filter_exists
        double_season = (self.split_by == SplitByType.SEASON) & (self.season_filter not in [None, ''])
        double_year = (self.split_by == SplitByType.YEAR) & year_filter_exists
        double_month = (self.split_by == SplitByType.MONTH) & month_filter_exists
        if double_oppo | double_season | double_year | double_month:
            is_table_ranked = False
        return_me = []
        return_me.append(
            self.get_split_by_table(
                matches=matches,
                split_by=self.split_by,
                is_table_ranked=is_table_ranked
            )
        )
        if oppo_filter_exists | month_filter_exists | year_filter_exists:
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
            title='MATCHES'
        )