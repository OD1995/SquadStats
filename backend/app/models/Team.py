from dataclasses import dataclass
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4
from sqlalchemy import Enum, ForeignKey, String
from app import db
from app.models import Base
from app.models.Club import Club
from app.models.DataSource import DataSource
from app.models.Sport import Sport
from app.models.TeamLeague import TeamLeague
from app.models.TeamName import TeamName
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.types.enums import Sport as SportEnum, DataSource as DataSourceEnum

if TYPE_CHECKING:
    from app.models.TeamSeason import TeamSeason
else:
    TeamSeason = 'TeamSeason'

@dataclass
class Team(Base):
    __tablename__ = 'teams'
    __table_args__ = {"mysql_engine": "InnoDB"}

    team_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_id: Mapped[UUID] = mapped_column(
        ForeignKey("clubs.club_id", name="fk_clubs_club_id"),
        index=True
    )
    sport_id: Mapped[SportEnum] = mapped_column(
        Enum(SportEnum),
        ForeignKey("sports.sport_id", name="fk_sports_sport_id"),
        index=True
    )    
    data_source_id: Mapped[DataSourceEnum] = mapped_column(
        Enum(DataSourceEnum),
        ForeignKey("data_sources.data_source_id", name='fk_data_sources_data_source_id'),
        index=True,
        nullable=True
    )
    data_source_team_id: Mapped[str] = mapped_column(String(100), nullable=True)
    team_names: Mapped[List["TeamName"]] = relationship(lazy='joined')
    sport: Mapped[Sport] = relationship(lazy='joined')
    club: Mapped[Club] = relationship(back_populates='teams')
    team_leagues: Mapped[List["TeamLeague"]] = relationship(lazy='joined')
    data_source: Mapped[DataSource] = relationship(lazy='joined')
    team_seasons:Mapped[List["TeamSeason"]] = relationship(back_populates='team')

    def __init__(
        self,
        club_id:UUID,
        sport_id:str,
        data_source_id:DataSourceEnum,
        data_source_team_id:str
    ):
        self.team_id = uuid4()
        self.club_id = club_id
        self.sport_id = sport_id
        self.data_source_id = data_source_id
        self.data_source_team_id = data_source_team_id

    def get_default_team_name(self):
        for team_name in self.team_names:
            if team_name.is_default_name:
                return team_name.team_name
        return "[Default team name does not exist]"
    
    def get_team_name_str_list(self):
        return [
            tn.team_name
            for tn in self.team_names
        ]

    def get_team_info(self):
        return {
            'team_name' : self.get_default_team_name(),
            'sport' : self.sport.sport_name,
            'team_id' : self.team_id,
            'club_id' : self.club_id,
            'data_source_id' : self.data_source_id
        }