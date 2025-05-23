export enum CLUB_TYPE {
    COMPLETELY_NEW = 'completely-new',
    ALREADY_EXISTS = 'already-exists'
}

export enum DATA_SOURCE {
    FOOTBALL_ASSOCIATION = 'football-association',
    MANUAL = 'manual'
}

export enum PAGE_TYPE {
    LOGIN = 'Login',
    REGISTER = 'Register'
}

export enum SPLIT_BY_TYPE {
    NA = 'N/A',
    TOTAL = 'Total',
    OPPOSITION = 'Opposition',
    PLAYER_COUNT = 'Player Count',
    SEASON = 'Season',
    YEAR = 'Year',
    MONTH = 'Month',
    KO_TIME = 'KO Time',
}

export enum METRIC {
    APPEARANCES = 'Appearances',
    GOALS = 'Goals',
    HATTRICKS = 'Hattricks',
    POTM = 'POTM',
    CONSECUTIVE_APPS = 'Consecutive Matches Played',
    CONSECUTIVE_WINS = 'Consecutive Wins',
    CONSECUTIVE_GOALSCORING_MATCHES = 'Consecutive Goalscoring Matches',
    CONSECUTIVE_HATTRICKS = 'Consecutive Hattricks',
    POINTS_PER_GAME = 'Player Impact - Points Per Game',
    GOALS_SCORED = 'Player Impact - Goals Scored',
    GOALS_CONCEDED = 'Player Impact - Goals Conceded',
    GOAL_DIFFERENCE = 'Player Impact - Goal Difference',
    CLEAN_SHEETS = 'Clean Sheets',
    X_SHREK = 'xShrek',
    DAYS_BETWEEN_APPS = 'Days Between Appearances',
    IMPACT_GOALS = 'Impact Goals',
}

export enum MANUAL_DATA_ENTRY_ACTION_TYPE {
    ADD_NEW_LEAGUE = 'Add New League & Season',
    ADD_NEW_SEASON = 'Add New Season',
    ADD_NEW_MATCH = 'Add New Match',
    EDIT_MATCH = 'Edit Match'
}

export enum MATCH_LOCATION_TYPE {
    NEW_LOCATION = '-- New Location --'
}

export enum MATCH_COMPETITION_TYPE {
    NEW_COMPETITION = '-- New Competition --'
}

export enum UPDATE_MATCH_SECTIONS {
    MATCH_INFO = 'Match Info',
    PLAYERS = 'Players',
    GOALS_AND_POTM = 'Goals & POTM',
    MATCH_REPORT = 'Match Report'
}

export enum PLAYER_LIST_TYPE {
    ALL_PLAYERS = 'All Club Players',
    ACTIVE_PLAYERS = 'Active Players'
}

export enum MATCH_REPORT_TYPES {
    NO_ALREADY_EXISTS = "No, I'm happy with the already uploaded match report image(s)",
    YES_TEXT = 'Yes, in text form',
    YES_IMAGE = 'Yes, in image form',
    NO = 'No'
}