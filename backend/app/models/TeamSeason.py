from uuid import UUID
from sqlalchemy import ForeignKey
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class TeamSeason(db.Model):
    __tablename__ = 'team_seasons'

    team_season_id: Mapped[UUID] = mapped_column(primary_key=True)
    team_id: Mapped[UUID] = mapped_column(
        ForeignKey("teams.team_id", name="fk_teams_team_id"),
        index=True
    )
    season_id: Mapped[UUID] = mapped_column(
        ForeignKey("seasons.season_id", name="fk_seasons_season_id"),
        index=True
    )
    data_source_id: Mapped[UUID] = mapped_column(
        ForeignKey("data_sources.data_source_id", name='fk_data_sources_data_source_id'),
        index=True
    )