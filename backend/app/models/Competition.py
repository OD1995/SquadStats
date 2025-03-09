from typing import List
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.TeamSeason import TeamSeason

class Competition(Base):
    __tablename__ = 'competitions'
    __table_args__ = {"mysql_engine": "InnoDB"}

    competition_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_competition_id: Mapped[str] = mapped_column(String(100), nullable=True)
    competition_name: Mapped[str] = mapped_column(String(100))
    league_id: Mapped[UUID] = mapped_column(
        ForeignKey("leagues.league_id", name="fk_leagues_league_id"),
        index=True
    )
    competition_acronym: Mapped[str] = mapped_column(String(10), nullable=True)

    def __init__(
        self,
        data_source_competition_id:str|None,
        competition_name:str,
        competition_acronym:str|None,
        league_id:UUID
    ):
        self.competition_id = uuid4()
        self.data_source_competition_id = data_source_competition_id
        self.competition_name = competition_name
        self.league_id = league_id
        self.competition_acronym = competition_acronym

    def get_competition_info(self):
        return {
            
        }