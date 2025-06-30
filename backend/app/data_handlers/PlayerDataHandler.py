from typing import List
from uuid import UUID
from app.data_handlers.DataHandler import DataHandler
from app import db
from app.helpers.misc import get_goal_metrics, get_potm_metrics, get_unappearance_metrics
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import SplitByType


class PlayerDataHandler(DataHandler):

    def __init__(
        self,
        player_id:str
    ):
        DataHandler.__init__(self)
        self.player_id = UUID(player_id)

    def get_player_apps_result(self):
        player_match_data = db.session.query(Match, PlayerMatchPerformance, Metric) \
            .select_from(Match) \
            .join(PlayerMatchPerformance) \
            .join(Metric) \
            .filter(
                PlayerMatchPerformance.player_id == self.player_id,
                Metric.metric_name.not_in(get_unappearance_metrics())
            ) \
            .all()
        row_data = {}
        unique_metrics = {}
        for match, pmp, metric in player_match_data:
            if str(match.match_id) not in row_data:
                if match.goal_difference > 0:
                    res = 'win'
                elif match.goal_difference == 0:
                    res = 'draw'
                else:
                    res = 'loss'
                row_data[str(match.match_id)] = {
                    'Opposition' : GenericTableCell(
                        value=f"{match.opposition_team_name} ({match.home_away_neutral.value[0]})",
                        link=f"/team/{match.team_season.team_id}/match/{match.match_id}"
                    ),
                    'Result' : GenericTableCell(
                        value=f"{match.goals_for}-{match.goals_against}",
                        class_name=f'{res}-result'
                    ),
                    'Date' : GenericTableCell(
                        value=match.date
                    )
                }
            met_name = metric.get_best_metric_name()
            unique_metrics[met_name] = 1
            row_data[str(match.match_id)][met_name] = GenericTableCell(value=pmp.value)
        player = self.get_player()
        return {
            'player_name' : player['player_name'],
            'club_id' : player['club_id'],
            'table_data' : GenericTableData(
                column_headers=self.get_ordered_player_data_columns(
                    unique_metrics=unique_metrics.keys(),
                    is_match=False
                ),
                rows=[
                    GenericTableRow(row_data=rd)
                    for rd in row_data.values()
                ],
                sort_by="Date",
                sort_direction="asc"
            ).to_dict()
        }

    def get_player_info_result(self):
        player_matches1 = db.session.query(Match) \
            .join(PlayerMatchPerformance) \
            .join(Metric) \
            .filter(
                PlayerMatchPerformance.player_id == self.player_id,
                Metric.metric_name.not_in(get_unappearance_metrics())
            ) \
            .all()
        ## Logic to deal with where player is 'Bench Unused' but also has another value (e.g. Captain)
        player_matches = []
        for match in player_matches1:
            if str(self.player_id) in match.get_active_player_dict():
                player_matches.append(match)
        return {
            'player' : self.get_player(),
            'tables' : self.get_tables(player_matches),
            'player_stats' : self.get_player_data(player_matches)
        }
    
    def get_player_data(
        self,
        player_matches:List[Match]
    ):
        goals = 0
        goal_mets = get_goal_metrics()
        potms = 0
        potm_mets = get_potm_metrics()
        for match in player_matches:
            pmps_by_player_id, _ = match.get_pmps_by_player_id()
            for metric_name, metric_val in pmps_by_player_id[str(self.player_id)].items():
                if metric_name in goal_mets:
                    goals += metric_val
                if metric_name in potm_mets:
                    potms += 1
        return {
            'appearances' : len(player_matches),
            'goals' : goals,
            'potms' : potms
        }
    
    def get_player(self):
        player = db.session.query(Player) \
            .filter_by(player_id=self.player_id) \
            .first()
        return player.to_dict(include_both_names=True)
    
    def get_tables(
        self,
        player_matches:List[Match]
    ):
        tables = []
        tables.append(self.get_total_table(player_matches))
        tables.extend(self.get_team_tables(player_matches))
        return [
            t.to_dict()
            for t in tables
        ]

    def get_team_tables(
        self,
        player_matches:List[Match]
    ):
        unique_teams = {
            match.team_season.team_id : match.team_season.team.get_default_team_name()
            for match in player_matches
        }
        team_matches = db.session.query(Match) \
            .join(TeamSeason) \
            .filter(TeamSeason.team_id.in_(list(unique_teams.keys()))) \
            .all()
        matches_by_team = {}
        for match in team_matches:
            key = match.team_season.team_id
            if key not in matches_by_team:
                matches_by_team[key] = []
            matches_by_team[key].append(match)
        return [
            self.get_split_by_table(
                matches=matches_by_team[team_id],
                split_by=SplitByType.WITH_OR_WITHOUT,
                is_table_ranked=False,
                title=team_name.upper(),
                player_id=str(self.player_id)
            )
            for team_id, team_name in unique_teams.items()
        ]
    
    def get_total_table(
        self,
        player_matches:List[Match]
    ):
        return self.get_split_by_table(
            matches=player_matches,
            split_by=None,
            is_table_ranked=False,
            title='TOTAL'
        )