from datetime import datetime, timezone
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4
from sqlalchemy import String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from dataclasses import dataclass

if TYPE_CHECKING:
    from app.models.Team import Team
else:
    Team = 'Team'

@dataclass
class Club(Base):
    __tablename__ = 'clubs'
    __table_args__ = {"mysql_engine": "InnoDB"}

    club_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_name: Mapped[str] = mapped_column(String(50))
    data_source_club_id: Mapped[str] = mapped_column(String(50), nullable=True)
    time_created: Mapped[datetime]
    teams: Mapped[List["Team"]] = relationship(back_populates='club')

    def __init__(
        self,
        club_name: str,
        data_source_club_id: str|None
    ):
        self.club_id = uuid4()
        self.club_name = club_name
        self.data_source_club_id = data_source_club_id
        self.time_created = datetime.now(timezone.utc)

    def get_club_id(self):
        return str(self.club_id)
    
    def get_club_info(self):
        return {
            'club_name' : self.club_name,
            'club_id' : self.club_id,
            'teams' : [
                team.get_team_info()
                for team in self.teams
            ]
        }