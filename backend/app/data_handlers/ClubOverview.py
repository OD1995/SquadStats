from uuid import UUID

from sqlalchemy import Row, func
from app import db
from app.data_handlers.Overview import Overview
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.types.GenericTableCell import GenericTableCell
from app.types.GenericTableData import GenericTableData
from app.types.GenericTableRow import GenericTableRow
from app.types.enums import Metric as MetricEnum

class ClubOverview(Overview):

    def __init__(
        self,
        club_id:str
    ):
        self.club_id = UUID(club_id)

    def get_data(self):
        return {
            'teams' : [
                self.get_biggest_wins(),
                self.get_biggest_losses(),
            ],
            'players' : [
                self.get_top_appearances(),
                self.get_top_goals(),
            ]
        }

    def get_top_appearances(self):
        top_appearances = db.session.query(
                Player,
                func.sum(PlayerMatchPerformance.value)
            ) \
            .join(Player) \
            .join(Match) \
            .join(TeamSeason) \
            .join(Team) \
            .join(Metric) \
            .group_by(Player) \
            .order_by(
                func.sum(PlayerMatchPerformance.value).desc(),
                Player.data_source_player_name
            ) \
            .filter(
                Team.club_id == self.club_id,
                Metric.metric_name == MetricEnum.APPEARANCES
            ) \
            .limit(5) \
            .all()
        return self.create_table_data_for_player_stats(
            title='Top Appearance Makers',
            stat_name='Appearances',
            player_stats=top_appearances
        )
    
    def get_top_goals(self):
        top_goals = db.session.query(
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
                func.sum(PlayerMatchPerformance.value).desc(),
                Player.data_source_player_name
            ) \
            .filter(
                Team.club_id == self.club_id,
                Metric.metric_name == MetricEnum.OVERALL_GOALS
            ) \
            .limit(5) \
            .all()
        return self.create_table_data_for_player_stats(
            title='Top Goalscorers',
            stat_name='Goals',
            player_stats=top_goals
        )
        
    def get_matches_query(self):
        return db.session.query(Match) \
            .join(TeamSeason) \
            .join(Team) \
            .filter(
                Team.club_id==self.club_id,
                Match.goal_difference.isnot(None)
            )
    
    def get_biggest_wins(self):        
        biggest_wins = self.get_matches_query() \
            .order_by(
                Match.goal_difference.desc(),
                Match.opposition_team_name
            )  \
            .limit(5)\
            .all()
        return self.create_table_data_for_matches(
            title='Biggest Wins',
            matches=biggest_wins
        )

    def get_biggest_losses(self):        
        biggest_losses = self.get_matches_query() \
            .order_by(
                Match.goal_difference.asc(),
                Match.opposition_team_name
            ) \
            .limit(5) \
            .all()
        return self.create_table_data_for_matches(
            title='Biggest Losses',
            matches=biggest_losses
        )