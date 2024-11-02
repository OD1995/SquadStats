from enum import Enum

class ClubType(Enum):
    COMPLETELY_NEW = 'completely-new'
    ALREADY_EXISTS = 'already-exists'

class DataSource(Enum):
    FOOTBALL_ASSOCIATION = 'football-association'
    MANUAL = 'manual'