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
    OPPOSITION = 'Opposition',
    PLAYER_COUNT = 'Player Count',
    SEASON = 'Season',
    YEAR = 'Year'
}

// export enum LEADERBOARD_TYPE {
//     APPEARANCES = 'Appearances',
//     APPEARANCES_BY_SEASON = 'Appearances By Season',
//     APPEARANCES_BY_YEAR = 'Appearances By Year',
//     GOALS = 'Goals',
//     GOALS_PER_GAME = 'Goals Per Game'
// }

export enum METRIC {
    APPEARANCES = 'Appearances',
    GOALS = 'Goals',
    HATTRICKS = 'Hattricks',
    POTM = 'POTM',
    CONSECUTIVE_APPS = 'Consecutive Matches Played',
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