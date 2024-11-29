from dataclasses import dataclass
from typing import List
from uuid import UUID, uuid4
from datetime import date as dateDT, time as timeDT
from sqlalchemy import Enum, ForeignKey, String
from app.models import Base
from app.models.Competition import Competition
from app.models.MatchError import MatchError
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.TeamSeason import TeamSeason
from app.types.enums import HomeAwayNeutral, Result

@dataclass
class Match(Base):
    __tablename__ = 'matches'
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    match_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_match_id: Mapped[str] = mapped_column(String(50))
    competition_id: Mapped[UUID] = mapped_column(
        ForeignKey("competitions.competition_id", name="fk_competitions_competition_id"),
        index=True,
        nullable=True
    )
    team_season_id: Mapped[UUID] = mapped_column(
        ForeignKey("team_seasons.team_season_id", name="team_seasons_team_season_id"),
        index=True
    )
    competition_acronym: Mapped[str] = mapped_column(String(10), nullable=True)
    goals_for: Mapped[int] = mapped_column(nullable=True)
    goals_against: Mapped[int] = mapped_column(nullable=True)
    goal_difference: Mapped[int] = mapped_column(nullable=True)
    pens_for: Mapped[int] = mapped_column(nullable=True)
    pens_against: Mapped[int] = mapped_column(nullable=True)
    opposition_team_name: Mapped[str] = mapped_column(String(100), nullable=True)
    result: Mapped[Result] = mapped_column(Enum(Result), nullable=True)
    date: Mapped[dateDT] = mapped_column(nullable=True)
    time: Mapped[timeDT] = mapped_column(nullable=True)
    location: Mapped[str] = mapped_column(String(100), nullable=True)
    home_away_neutral: Mapped[HomeAwayNeutral] = mapped_column(Enum(HomeAwayNeutral), nullable=True)
    match_errors: Mapped[List["MatchError"]] = relationship(lazy='joined')
    # team_season: Mapped[TeamSeason] = relationship(lazy='joined')

    def __init__(
        self,
        data_source_match_id:str,
        team_season_id:UUID,
        competition_id:UUID|None,
        competition_acronym:str,
        goals_for:int,
        goals_against:int,
        goal_difference:int,
        pens_for:int,
        pens_against:int,
        opposition_team_name:str,
        result:Result,
        date:dateDT,
        time:timeDT,
        location:str,
        home_away_neutral:HomeAwayNeutral
    ):
        self.match_id = uuid4()
        self.data_source_match_id = data_source_match_id
        self.team_season_id = team_season_id
        self.competition_id = competition_id
        self.competition_acronym = competition_acronym
        self.goals_for = goals_for
        self.goals_against = goals_against
        self.goal_difference = goal_difference
        self.pens_for = pens_for
        self.pens_against = pens_against
        self.opposition_team_name = opposition_team_name
        self.result = result
        self.date = date
        self.time = time
        self.location = location
        self.home_away_neutral = home_away_neutral

    def to_dict(self):
        return {
            'match_id' : self.match_id,
            'data_source_match_id' : self.data_source_match_id,
            'team_season_id' : self.team_season_id,
            'competition_acronym' : self.competition_acronym,
            'goals_for' : self.goals_for,
            'goals_against' : self.goals_against,
            'goal_difference' : self.goal_difference,
            'pens_for' : self.pens_for,
            'pens_against' : self.pens_against,
            'opposition_team_name' : self.opposition_team_name,
            'result' : self.result,
            'date' : self.date.strftime("%d %b %y"),
            'time' : self.time.strftime("%H:%M"),
            'location' : self.location,
            'home_away_neutral' : self.home_away_neutral,
            'match_errors' : self.match_errors,
            'player_info_scraped' : False
        }