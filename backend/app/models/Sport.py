from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

from app.types.enums import DataSource

class Sport(db.Model):
    __tablename__ = 'sports'

    sport_id: Mapped[DataSource] = mapped_column(primary_key=True)
    sport_name: Mapped[str] = mapped_column(String(50))