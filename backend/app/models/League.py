from dataclasses import dataclass
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4
from app.models.Competition import Competition
from app.types.enums import DataSource as DataSourceEnum
from sqlalchemy import String, Enum, ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models.TeamLeague import TeamLeague
    from app.models.LeagueSeason import LeagueSeason    
else:
    TeamLeague = 'TeamLeague'
    LeagueSeason = 'LeagueSeason'

@dataclass
class League(Base):
    __tablename__ = 'leagues'
    __table_args__ = {"mysql_engine": "InnoDB"}

    league_id: Mapped[UUID] = mapped_column(primary_key=True)
    league_name: Mapped[str] = mapped_column(String(100))
    data_source_league_id: Mapped[str] = mapped_column(String(50), nullable=True)
    data_source_id: Mapped[DataSourceEnum] = mapped_column(
        Enum(DataSourceEnum),
        ForeignKey("data_sources.data_source_id", name='fk_data_sources_data_source_id'),
        index=True,
        nullable=True
    )
    team_leagues: Mapped[List[TeamLeague]] = relationship(back_populates='league')
    league_seasons: Mapped[List[LeagueSeason]] = relationship(back_populates='league')
    competitions: Mapped[List[Competition]] = relationship(back_populates='league')

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
    
    def __repr__(self):
        return f"<League {self.league_id}"

    def get_league_info(self, include_team_season=False):
        return {
            'league_id' : self.league_id,
            'league_name' : self.league_name,
            'league_seasons' : {
                str(ls.league_season_id) : ls.get_league_season_info(include_team_season=include_team_season)
                for ls in self.league_seasons
            },
            'competitions' : [c.get_competition_info() for c in self.competitions]
        }