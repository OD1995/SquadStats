from uuid import UUID
from app import db
from app.models.Match import Match
from app.models.TeamSeason import TeamSeason

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
                rnk,
                f"{match.opposition_team_name} ({match.home_away_neutral.value[0]})",
                f"{match.goals_for}-{match.goals_against}",
                match.date.strftime("%d %b %Y")
            ])
        return {
            'title' : title,
            'column_headers' : [
                '',
                'Opposition',
                'Result',
                'Date'
            ],
            'rows' : rows
        }