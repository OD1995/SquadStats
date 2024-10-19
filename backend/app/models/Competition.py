from uuid import UUID
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Competition(db.Model):
    __tablename__ = 'competitions'

    competition_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_competition_id: Mapped[str] = mapped_column(String(100))
    competition_name: Mapped[str] = mapped_column(String(100))
    team_season_id: Mapped[UUID] = mapped_column(ForeignKey("team_seasons.team_season_id"))