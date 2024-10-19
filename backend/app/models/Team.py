from uuid import UUID
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Team(db.Model):
    __tablename__ = 'teams'

    team_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_id: Mapped[UUID] = mapped_column(ForeignKey("clubs.club_id"))
    sport_id: Mapped[UUID] = mapped_column(ForeignKey("sports.sport_id"))
    data_source_team_id: Mapped[str] = mapped_column(String(100))