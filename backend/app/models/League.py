from dataclasses import dataclass
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4
from app.types.enums import DataSource as DataSourceEnum
from sqlalchemy import String, Enum, ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models.TeamLeague import TeamLeague
else:
    TeamLeague = 'TeamLeague'


@dataclass
class League(Base):
    __tablename__ = 'leagues'
    __table_args__ = {"mysql_engine": "InnoDB"}

    league_id: Mapped[UUID] = mapped_column(primary_key=True)
    league_name: Mapped[str] = mapped_column(String(100))
    data_source_league_id: Mapped[str] = mapped_column(String(50))
    data_source_id: Mapped[DataSourceEnum] = mapped_column(
        Enum(DataSourceEnum),
        ForeignKey("data_sources.data_source_id", name='fk_data_sources_data_source_id'),
        index=True
    )
    team_leagues: Mapped[List[TeamLeague]] = relationship(back_populates='league')

    def __init__(
        self,
        league_name:str,
        data_source_league_id:str,
        data_source_id
    ):
        self.league_id = uuid4()
        self.league_name = league_name
        self.data_source_league_id = data_source_league_id
        self.data_source_id = data_source_id