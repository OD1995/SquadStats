from typing import List
from uuid import UUID

from sqlalchemy import column, func
from app.data_handlers.DataHandler import DataHandler
from app.helpers.QueryBuilder import QueryBuilder
from app import db
from app.helpers.misc import get_goal_metrics
from app.helpers.validators import is_valid_uuid
from app.models.LeagueSeason import LeagueSeason
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import Metric as MetricEnum, SplitByType

class LeaderboardDataHandler(DataHandler):

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
        split_by:str|None,
        season_filter:str,
        opposition_filter:str|None,
        team_id_filter:str|None,
        per_game:bool|None,
        min_apps:int|None
    ):
        """
        metric - should be one of Metric options
        club_id - None (if focus is on team matches) or uuid
        team_id - None (if focus is on club matches) or uuid
        season_filter - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition_filter - None or str (opposition_team_name)
        team_id_filter - '' or uuid
        """
        DataHandler.__init__(self)
        self.metric = metric
        self.club_id = club_id
        self.team_id = team_id
        self.season_filter = season_filter
        self.opposition_filter = opposition_filter
        self.team_id_filter = team_id_filter
        self.split_by = split_by
        self.query_split_by = self.get_query_split_by()
        self.per_game = False if ((per_game == "False") or (per_game is None)) else True
        self.min_apps = None if (min_apps is None) else int(min_apps)

        self.PLAYER = 'Player'
        self.PER_GAME = 'Per Game'

        self.metric_lookup = {
            MetricEnum.GOALS : get_goal_metrics()
        }

    def get_result(self):
        if self.metric in [
            MetricEnum.APPEARANCES,
            MetricEnum.GOALS
        ]:
            return self.get_standard_metric_result()
        raise Exception('Unexpected metric')
    
    def get_query_split_by(self):
        split_by_lookup = {
            SplitByType.YEAR : func.year(Match.date).label(SplitByType.YEAR.value),
            SplitByType.SEASON : LeagueSeason.data_source_season_name.label(SplitByType.SEASON.value),
            # SplitByType.
        }
        return split_by_lookup.get(self.split_by, None)
    
    def get_standard_metric_result(self):
        column_headers = [self.PLAYER]
        if self.query_split_by is not None:
            column_headers.append(self.split_by)
        important_metric = f"{self.metric} {self.PER_GAME}" if self.per_game else self.metric
        column_headers.append(important_metric)
        if self.per_game:
            column_headers.append(MetricEnum.APPEARANCES)
            query_selectors = [Player]
            group_by_list = [Player]
            if self.query_split_by is not None:
                query_selectors.append(self.query_split_by)
                group_by_list.append(self.query_split_by)
            perf_col = func.sum(PlayerMatchPerformance.value).label(self.metric)
            app_col = func.sum(PlayerMatchPerformance.value).label(MetricEnum.APPEARANCES)

            player_performances = self.get_complicated_player_performances(
                query_selectors=query_selectors + [perf_col],
                filters=[
                    Metric.metric_name.in_(self.metric_lookup.get(self.metric, [self.metric]))
                ] + self.get_filters(),
                order_by_list=[],
                group_by_list=group_by_list,
                return_all=False
            )
            player_appearances = self.get_complicated_player_performances(
                query_selectors=query_selectors + [app_col],
                filters=[
                    Metric.metric_name == MetricEnum.APPEARANCES
                ] + self.get_filters(),
                group_by_list=group_by_list,
                havings=[func.sum(PlayerMatchPerformance.value) >= self.min_apps] if self.min_apps else [],
                return_all=False
            )
            combined_results = db.session.query(player_performances, player_appearances) \
                .join(
                    player_performances,
                    player_performances.c.player_id == player_appearances.c.player_id
                ).all()
            rows = []
            for res in combined_results:
                res_dict = res._mapping
                player_name = res.better_player_name or res.data_source_player_name
                row_data = {}
                row_data[self.PLAYER] = GenericTableCell(
                    value=player_name,
                    link=f"/player/{res.player_id}/overview"
                )
                row_data[f"{self.metric} {self.PER_GAME}"] = GenericTableCell(
                    value=round(
                        res_dict[self.metric] / res_dict[MetricEnum.APPEARANCES],
                        2
                    )
                )
                row_data[MetricEnum.APPEARANCES] = GenericTableCell(
                    value=res_dict[MetricEnum.APPEARANCES]
                )
                if self.split_by:
                    row_data[self.split_by] = GenericTableCell(
                        value=res_dict[self.split_by]
                    )
                rows.append(GenericTableRow(row_data=row_data))
        else:
            player_performances = self.get_player_performances(
                filters=[
                    Metric.metric_name.in_(self.metric_lookup.get(self.metric, [self.metric]))
                ] + self.get_filters(),
                split_by=self.query_split_by,
                sort_value_desc=True
            )
            rows = self.get_rows(player_performances,column_headers)
        return [
            GenericTableData(
                column_headers=column_headers,
                rows=rows,
                title=important_metric.upper(),
                is_ranked=True,
                sort_by=important_metric,
                sort_direction='desc'
            ).to_dict()
        ]
    
    def get_rows(
        self,
        player_performances,
        column_headers
    ):
        rows = []
        for pp in player_performances:
            row_dict = {}
            for i, ch in enumerate(column_headers):
                if ch == self.PLAYER:
                    val = GenericTableCell(
                        value=pp[i].get_best_name(),
                        link=f"/player/{pp[i].player_id}/overview"
                    )
                else:
                    val = GenericTableCell(
                        value=pp[i]
                    )
                row_dict[ch] = val
            rows.append(
                GenericTableRow(
                    row_data=row_dict
                )
            )
        return rows

    # def get_goals_result(self):
    #     pass

    # def get_filters(self):
    #     filters = []
    #     ## Team/Club filtering
    #     if self.team_id in [None, '']:
    #         filters.append(Team.club_id == UUID(self.club_id))
    #     else:
    #         filters.append(Team.team_id == UUID(self.team_id))
    #     if self.team_id_filter is not None:
    #         filters.append(Team.team_id == UUID(self.team_id_filter))
    #     ## Season filtering
    #     filters.append(self.get_season_filter())
    #     if self.opposition not in [None, '']:
    #         filters.append(Match.opposition_team_name == self.opposition)
    #     return filters
    
    # def get_season_filter(self):
    #     if self.season_filter not in [None, '']:
    #         # matches_query.add_join(LeagueSeason)
    #         if is_valid_uuid(self.season_filter):
    #             return LeagueSeason.league_season_id == UUID(self.season_filter)
    #         else:
    #             return LeagueSeason.data_source_season_name == self.season_filter
    #     return None
        
    # def get_app_result(self):
    #     # pmp_list = self.get_pmps()
    #     # player_dict = {}
    #     # player_data_dict = {}
    #     # for pmp in pmp_list:
    #     #     key1 = str(pmp.player_id)
    #     #     key2 = str(pmp.match_id)
    #     #     player_dict[key1] = pmp.player
    #     #     if key1 not in player_data_dict:
    #     #         player_data_dict[key1] = {}
    #     #     if key2 not in player_data_dict[key1]:
    #     #         player_data_dict[key1][key2] = {}
    #     #     player_data_dict[key1][key2][pmp.metric.get_best_metric_name()] = pmp.value
    #     # result_dict = {}
    #     # for player_id, player_match_dict in player_data_dict.items():
    #     #     player_app_count = 0
    #     #     for match_id, match_dict in player_match_dict.items():
    #     #         if :
    #     #             player_app_count += 
    #     result_dict = {}
    #     player_id_dict = {}
    #     matches = self.get_matches(
    #         filters=self.get_filters()
    #     )
    #     for match in matches:
    #         for player_id, player_obj in match.get_active_player_dict().items():
    #             player_id_dict[player_id] = player_obj
    #             if player_id not in result_dict:
    #                 result_dict[player_id] = 0
    #             result_dict[player_id] += 1
    #     rows = []
    #     column_headers = [
    #         self.PLAYER,
    #         self.metric
    #     ]
    #     for player_id, value in result_dict.items():
    #         rows.append(
    #             GenericTableRow(
    #                 row_data={
    #                     self.PLAYER : GenericTableCell(
    #                         value=player_id_dict[player_id].get_best_name(),
    #                         link=f"/player/{player_id}"
    #                     ),
    #                     self.metric : GenericTableCell(
    #                         value=value
    #                     )
    #                 }
    #             )
    #         )
    #     return [
    #         GenericTableData(
    #             column_headers=column_headers,
    #             rows=sorted(
    #                 rows,
    #                 key=lambda x: x.get_cell_value(self.metric),
    #                 reverse=True
    #             ),
    #             title='APPEARANCES',
    #             is_ranked=True,
    #             not_sortable=False,
    #             sort_by=self.metric,
    #             sort_direction='desc'
    #         ).to_dict()
    #     ]

            
    # def get_pmps(self) -> List[PlayerMatchPerformance]:
    #     apps_query = QueryBuilder(
    #         db.session.query(PlayerMatchPerformance)
    #     )
    #     ###### Add filters
    #     return apps_query.all()
