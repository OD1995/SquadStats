from uuid import UUID

from sqlalchemy import Row, func
from app import db
from app.models.Match import Match
from app.models.Metric import Metric
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance
from app.models.TeamSeason import TeamSeason
from app.types.enums import Metric as MetricEnum

class TeamOverview:

    def __init__(
        self,
        team_id:str
    ):
        self.team_id = UUID(team_id)

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
            .join(Metric) \
            .group_by(Player) \
            .order_by(func.sum(PlayerMatchPerformance.value).desc()) \
            .filter(
                TeamSeason.team_id == self.team_id,
                Metric.metric_name == MetricEnum.APPEARANCES
            ) \
            .limit(5) \
            .all()
        return self.create_table_data_dict_for_player_stats(
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
            .group_by(Player) \
            .order_by(func.sum(PlayerMatchPerformance.value).desc()) \
            .filter(
                TeamSeason.team_id == self.team_id,
                Metric.metric_name == MetricEnum.OVERALL_GOALS
            ) \
            .limit(5) \
            .all()
        return self.create_table_data_dict_for_player_stats(
            title='Top Goalscorers',
            stat_name='Goals',
            player_stats=top_goals
        )
            
    def create_table_data_dict_for_player_stats(
        self,
        title:str,
        stat_name:str,
        player_stats:Row
    ):
        rows = []
        for player, stat in player_stats:
            rows.append([
                player.get_best_name(),
                stat
            ])
        return {
            'title' : title,
            'column_headers' : [
                'Player',
                stat_name
            ],
            'rows' : rows
        }
    
    def get_biggest_wins(self):        
        biggest_wins = db.session.query(Match) \
            .join(TeamSeason) \
            .filter(TeamSeason.team_id==self.team_id) \
            .order_by(Match.goal_difference.desc()) \
            .limit(5) \
            .all()
        return self.create_table_data_dict_for_matches(
            title='Biggest Wins',
            matches=biggest_wins
        )
        
    def get_biggest_losses(self):        
        biggest_losses = db.session.query(Match) \
            .join(TeamSeason) \
            .filter(TeamSeason.team_id==self.team_id) \
            .order_by(Match.goal_difference.asc()) \
            .limit(5) \
            .all()
        return self.create_table_data_dict_for_matches(
            title='Biggest Losses',
            matches=biggest_losses
        )
        
    def create_table_data_dict_for_matches(
        self,
        title:str,
        matches:list[Match]
    ):
        rows = []
        for rnk,match in enumerate(matches,1):
            rows.append([
                f"{match.opposition_team_name} ({match.home_away_neutral.value[0]})",
                f"{match.goals_for}-{match.goals_against}",
                match.date.strftime("%d %b %Y")
            ])
        return {
            'title' : title,
            'column_headers' : [
                'Opposition',
                'Result',
                'Date'
            ],
            'rows' : rows
        }