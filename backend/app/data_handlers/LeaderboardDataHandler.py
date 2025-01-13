from typing import List
from app.data_handlers.AnalysisDataHandler import AnalysisDataHandler
from app.helpers.QueryBuilder import QueryBuilder
from app import db
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import LeaderboardType, Metric

class LeaderboardDataHandler(AnalysisDataHandler):

#     Appearances
# Appearances
# Appearances By Season

# Goals
# Goals
# Goals Per Game
# Goals By Season
# Hattricks

# MOTMs
# MOTMs
# MOTMs Per Game

# Streaks
# Consecutive Games Played
# Consecutive Wins
# Consecutive Goalscoring Games

# Player Impact (Min 10 Apps)
# Points Per Game
# Goals Scored
# Goals Conceded
# Goal Difference

    def __init__(
        self,
        metric:str,
        club_id:str|None,
        team_id:str|None,
        season:str,
        opposition:str|None,
        team_id_filter:str|None
    ):
        """
        metric - should be one of Metric options
        club_id - None (if focus is on team matches) or uuid
        team_id - None (if focus is on club matches) or uuid
        season - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition - None or str (opposition_team_name)
        team_id_filter - '' or uuid
        """
        self.metric = metric
        self.club_id = club_id
        self.team_id = team_id
        self.season = season
        self.opposition = opposition
        self.team_id_filter = team_id_filter

        self.PLAYER = 'Player'

    def get_result(self):
        if self.metric == Metric.APPEARANCES:
            return self.get_app_result()
        if self.metric == Metric.GOALS:
            return self.get_goals_result()
        raise Exception('Unexpected metric')
        
    def get_goals_result(self):
        pass
        
    def get_app_result(self):
        # pmp_list = self.get_pmps()
        # player_dict = {}
        # player_data_dict = {}
        # for pmp in pmp_list:
        #     key1 = str(pmp.player_id)
        #     key2 = str(pmp.match_id)
        #     player_dict[key1] = pmp.player
        #     if key1 not in player_data_dict:
        #         player_data_dict[key1] = {}
        #     if key2 not in player_data_dict[key1]:
        #         player_data_dict[key1][key2] = {}
        #     player_data_dict[key1][key2][pmp.metric.get_best_metric_name()] = pmp.value
        # result_dict = {}
        # for player_id, player_match_dict in player_data_dict.items():
        #     player_app_count = 0
        #     for match_id, match_dict in player_match_dict.items():
        #         if :
        #             player_app_count += 
        result_dict = {}
        player_id_dict = {}
        matches = self.get_matches()
        for match in matches:
            for player_id, player_obj in match.get_active_player_dict().items():
                player_id_dict[player_id] = player_obj
                if player_id not in result_dict:
                    result_dict[player_id] = 0
                result_dict[player_id] += 1
        rows = []
        column_headers = [
            self.PLAYER,
            self.metric
        ]
        for player_id, value in result_dict.items():
            rows.append(
                GenericTableRow(
                    row_data={
                        self.PLAYER : GenericTableCell(
                            value=player_id_dict[player_id].get_best_name(),
                            link=f"/player/{player_id}"
                        ),
                        self.metric : GenericTableCell(
                            value=value
                        )
                    }
                )
            )
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=sorted(
                    rows,
                    key=lambda x: x.get_cell_value(self.metric),
                    reverse=True
                ),
                title='APPEARANCES',
                is_ranked=True,
                not_sortable=False,
                sort_by=self.metric,
                sort_direction='desc'
            ).to_dict()
        ]

            
    def get_pmps(self) -> List[PlayerMatchPerformance]:
        apps_query = QueryBuilder(
            db.session.query(PlayerMatchPerformance)
        )
        ###### Add filters
        return apps_query.all()
