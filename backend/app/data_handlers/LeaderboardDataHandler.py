from app.helpers.QueryBuilder import QueryBuilder
from app import db
from app.models.Player import Player
from app.models.PlayerMatchPerformance import PlayerMatchPerformance

class LeaderboardDataHandler:

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
        leaderboard_type:str,
        club_id:str|None,
        team_id:str|None,
        # season:str,
        # opposition:str|None,
        # team_id_filter:str|None
    ):
        """
        leaderboard_type - should be one of LeaderboardType options
        club_id - None (if focus is on team matches) or uuid
        team_id - None (if focus is on club matches) or uuid
        season - '' or uuid (league_season_id) or str (data_source_season_name, if focus is on all club matches)
        opposition - None or str (opposition_team_name)
        team_id_filter - '' or uuid
        """
        self.leaderboard_type = leaderboard_type
        self.club_id = club_id
        self.team_id = team_id
        # self.season = season
        # self.opposition = opposition
        # self.team_id_filter = team_id_filter

    def get_appearances_by_player():
        apps_query = QueryBuilder(
            db.session.query(Player,PlayerMatchPerformance)
        )
        ###### Add filters
