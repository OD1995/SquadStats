from dataclasses import dataclass
from uuid import UUID
from sqlalchemy import String, Enum, ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.League import League

@dataclass
class TeamLeague(Base):
    __tablename__ = 'team_leagues'
    __table_args__ = {"mysql_engine": "InnoDB"}

    team_id: Mapped[UUID] = mapped_column(
        ForeignKey("teams.team_id", name="fk_teams_team_id"),
        index=True,
        primary_key=True
    )
    league_id: Mapped[UUID] = mapped_column(
        ForeignKey("leagues.league_id", name="fk_leagues_league_id"),
        index=True,
        primary_key=True
    )
    league: Mapped[League] = relationship(back_populates='team_leagues')

    def __init__(
        self,
        team_id:UUID,
        league_id:UUID
    ):
        self.team_id = team_id
        self.league_id = league_id

    def get_team_league_info(self):
        return {
            'league_name' : self.league.league_name,
            'league_id' : self.league_id
        }