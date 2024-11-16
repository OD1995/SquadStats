from uuid import UUID, uuid4
from datetime import date as dateDT, time as timeDT
from sqlalchemy import Enum, ForeignKey, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

from app.types.enums import HomeAwayNeutral, Result

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
    competition_acronym: Mapped[str] = mapped_column(String(10))
    goals_for: Mapped[int]
    goals_against: Mapped[int]
    goal_difference: Mapped[int]
    pens_for: Mapped[int]
    pens_against: Mapped[int]
    opposition_team_name: Mapped[str] = mapped_column(String(100))
    result: Mapped[Result] = mapped_column(Enum(Result))
    date: Mapped[dateDT]
    time: Mapped[timeDT]
    location: Mapped[str] = mapped_column(String(100))
    home_away_neutral: Mapped[HomeAwayNeutral] = mapped_column(Enum(HomeAwayNeutral))

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