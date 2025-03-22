from dataclasses import dataclass
from uuid import UUID, uuid4
from sqlalchemy import String, ForeignKey, null
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.League import League
from app.models.TeamSeason import TeamSeason

@dataclass
class LeagueSeason(Base):
    __tablename__ = 'league_seasons'
    __table_args__ = {"mysql_engine": "InnoDB"}

    league_season_id: Mapped[UUID] = mapped_column(primary_key=True)
    league_id: Mapped[UUID] = mapped_column(
        ForeignKey("leagues.league_id", name="fk_leagues_league_id"),
        index=True
    )
    data_source_league_season_id: Mapped[str] = mapped_column(
        String(50),
        nullable=True
    )
    data_source_season_name: Mapped[str] = mapped_column(String(100))
    league: Mapped[League] = relationship(back_populates='league_seasons')
    team_season: Mapped[TeamSeason] = relationship(back_populates='league_season')

    def __init__(
        self,
        league_id:UUID,
        data_source_season_name:str,
        data_source_league_season_id:str
    ):
        self.league_season_id = uuid4()
        self.league_id = league_id
        self.data_source_season_name = data_source_season_name
        self.data_source_league_season_id = data_source_league_season_id

    def get_league_season_info(self, include_team_season=False):
        return_dict = {
            'season_name' : self.data_source_season_name,
            'season_id' : self.league_season_id
        }
        if include_team_season and (self.team_season is not None):
            return_dict['team_season'] = self.team_season.get_team_season_info()
        return return_dict