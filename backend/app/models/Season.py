from sqlalchemy import String
from app import db
from uuid import UUID
from sqlalchemy.orm import Mapped, mapped_column

class Season(db.Model):
    __tablename__ = 'seasons'

    season_id: Mapped[UUID] = mapped_column(primary_key=True)
    season_name: Mapped[str] = mapped_column(String(50))
    data_source_season_id: Mapped[str] = mapped_column(String(50))