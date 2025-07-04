from enum import Enum

class ClubType(Enum):
    COMPLETELY_NEW = 'completely-new'
    ALREADY_EXISTS = 'already-exists'

class DataSource(str, Enum):
    FOOTBALL_ASSOCIATION: str = 'football-association'
    MANUAL: str = 'manual'

class Sport(str, Enum):
    FOOTBALL: str = 'football'

class Result(str, Enum):
    WIN: str = 'W'
    DRAW: str = 'D'
    LOSS: str = 'L'

class HomeAwayNeutral(str, Enum):
    HOME: str = 'H'
    AWAY: str = 'A'
    NEUTRAL: str = 'N'

class Metric(str, Enum):
    APPEARANCES: str = 'Appearances'
    OVERALL_GOALS: str = 'Overall Goals'
    FEATURED_PLAYER: str = 'Featured Player'
    GOALS: str = 'Goals'
    ASSISTS: str = 'Assists'
    PLAYER_OF_MATCH: str = 'Player Of Match'
    BENCH_UNUSED: str = 'Bench Unused'
    POTM: str = 'POTM'
    HATTRICKS: str = 'Hattricks'
    CONSECUTIVE_APPS: str = 'Consecutive Matches Played'
    CONSECUTIVE_WINS: str = 'Consecutive Wins'
    CONSECUTIVE_GOALSCORING_MATCHES: str = 'Consecutive Goalscoring Matches'
    CONSECUTIVE_HATTRICKS: str = 'Consecutive Hattricks'
    POINTS_PER_GAME: str = 'Player Impact - Points Per Game'
    GOALS_SCORED: str = 'Player Impact - Goals Scored'
    GOALS_CONCEDED: str = 'Player Impact - Goals Conceded'
    GOAL_DIFFERENCE: str = 'Player Impact - Goal Difference'
    CLEAN_SHEETS: str = 'Clean Sheets'
    X_SHREK: str = 'xShrek'
    DAYS_BETWEEN_APPS: str = 'Days Between Appearances'
    IMPACT_GOALS: str = 'Impact Goals'
    IMPACT_GOAL_RATIO: str = 'Impact Goal Ratio'

class SplitByType(str, Enum):
    NA: str = 'N/A'
    TOTAL: str = 'Total'
    OPPOSITION: str = 'Opposition'
    PLAYER_COUNT: str = 'Player Count'
    SEASON: str = 'Season'
    YEAR: str = 'Year'
    MONTH: str = 'Month'
    WITH_OR_WITHOUT: str = ''
    KO_TIME: str = 'KO Time'
    MONTH_AND_YEAR: str = 'Month & Year'

class LeaderboardType(str, Enum):    
    APPEARANCES: str = 'Appearances'
    APPEARANCES_BY_SEASON: str = 'Appearances By Season'
    APPEARANCES_BY_YEAR: str = 'Appearances By Year'
    GOALS: str = 'Goals'
    GOALS_PER_GAME: str = 'Goals Per Game'

class MiscStrings(str, Enum):
    WITH: str = 'With'
    WITHOUT: str = 'Without'
    OWN_GOALS: str = 'OWN GOALS'