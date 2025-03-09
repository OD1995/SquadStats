from dataclasses import dataclass
from re import M
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from app.models.Match import Match
    from app.models.LeagueSeason import LeagueSeason
    from app.models.Team import Team
else:
    Match = 'Match'
    LeagueSeason = 'LeagueSeason'
    Team = 'Team'

@dataclass
class TeamSeason(Base):
    __tablename__ = 'team_seasons'
    __table_args__ = {"mysql_engine": "InnoDB"}

    team_season_id: Mapped[UUID] = mapped_column(primary_key=True)
    team_id: Mapped[UUID] = mapped_column(
        ForeignKey("teams.team_id", name="fk_teams_team_id"),
        index=True
    )
    league_season_id: Mapped[UUID] = mapped_column(
        ForeignKey("league_seasons.league_season_id", name="fk_league_seasons_league_season_id"),
        index=True
    )
    team: Mapped[Team] = relationship(back_populates='team_seasons')
    league_season: Mapped[LeagueSeason] = relationship(back_populates='team_season')
    matches: Mapped[List["Match"]] = relationship(back_populates='team_season')
    # competition: Mapped[Com]

    def __init__(
        self,
        team_id:UUID,
        league_season_id:UUID
    ):
        self.team_season_id = uuid4()
        self.team_id = team_id
        self.league_season_id = league_season_id

    def get_team_season_info(self):
        return {
            'matches' : [
                m.to_dict()
                for m in self.matches
            ]
        }