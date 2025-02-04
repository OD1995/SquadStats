from dataclasses import dataclass
from sqlalchemy import ForeignKey, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID, uuid4

@dataclass
class TeamName(Base):
    __tablename__ = "team_names"
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    team_name_id: Mapped[UUID] = mapped_column(primary_key=True)
    team_id: Mapped[UUID] = mapped_column(
        ForeignKey("teams.team_id", name='fk_teams_team_id'),
        index=True
    )
    team_name: Mapped[str] = mapped_column(String(50))
    is_default_name: Mapped[bool]

    def __init__(
        self,
        team_id:UUID,
        team_name:str,
        is_default_name:bool,
        team_name_id:UUID|None=None
    ):
        
        self.team_name_id = team_name_id or uuid4()
        self.team_id = team_id
        self.team_name = team_name
        self.is_default_name = is_default_name