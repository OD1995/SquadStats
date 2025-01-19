from typing import List
from uuid import UUID
from app.data_handlers.DataHandler import DataHandler
from app import db
from app.helpers.misc import get_goal_metrics, get_unappearance_metrics
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.TeamSeason import TeamSeason
from app.types.enums import SplitByType


class PlayerDataHandler(DataHandler):

    def __init__(
        self,
        player_id:str
    ):
        DataHandler.__init__(self)
        self.player_id = UUID(player_id)

    def get_result(self):
        player_matches = db.session.query(Match) \
            .join(PlayerMatchPerformance) \
            .join(Metric) \
            .filter(
                PlayerMatchPerformance.player_id == self.player_id,
                Metric.metric_name.not_in(get_unappearance_metrics())
            ) \
            .all()
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
        for match in player_matches:
            pmps_by_player_id, _ = match.get_pmps_by_player_id()
            for metric_name, metric_val in pmps_by_player_id[str(self.player_id)].items():
                if metric_name in goal_mets:
                    goals += 1
        return {
            'appearances' : len(player_matches),
            'goals' : goals
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