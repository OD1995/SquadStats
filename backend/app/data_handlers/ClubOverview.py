from uuid import UUID

from app.data_handlers.DataHandler import DataHandler
from app.data_handlers.Overview import Overview
from app.helpers.misc import get_goal_metrics
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Team import Team
from app.types.enums import Metric as MetricEnum

class ClubOverview(Overview, DataHandler):

    def __init__(
        self,
        club_id:str
    ):
        self.club_id = UUID(club_id)

    def get_data(self):
        return {
            'matches' : [
                self.get_biggest_wins(),
                self.get_biggest_losses(),
            ],
            'players' : [
                self.get_top_appearances(),
                self.get_top_goals(),
            ]
        }

    def get_top_appearances(self):
        top_appearances = self.get_player_performances(
            filters=[
                Team.club_id == self.club_id,
                Metric.metric_name == MetricEnum.APPEARANCES
            ],
            limit=5
        )
        return self.create_table_data_for_player_stats(
            title='Top Appearance Makers',
            stat_name='Appearances',
            player_stats=top_appearances
        )
    
    def get_top_goals(self):
        top_goals = self.get_player_performances(
            filters=[
                Team.club_id == self.club_id,
                Metric.metric_name.in_(get_goal_metrics())
            ],
            limit=5
        )
        return self.create_table_data_for_player_stats(
            title='Top Goalscorers',
            stat_name='Goals',
            player_stats=top_goals
        )
        
    
    def get_biggest_wins(self):
        biggest_wins = self.get_matches(
            filters=[
                Match.goal_difference.isnot(None),
                Team.club_id == self.club_id
            ],
            order_bys=[
                Match.goal_difference.desc(),
                Match.opposition_team_name
            ],
            limit=5
        )
        return self.create_table_data_for_matches(
            title='Biggest Wins',
            matches=biggest_wins
        )

    def get_biggest_losses(self):    
        biggest_losses = self.get_matches(
            filters=[
                Match.goal_difference.isnot(None),
                Team.club_id == self.club_id
            ],
            order_bys=[
                Match.goal_difference.asc(),
                Match.opposition_team_name
            ],
            limit=5
        )
        return self.create_table_data_for_matches(
            title='Biggest Losses',
            matches=biggest_losses
        )