from uuid import UUID
from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Sport(db.Model):
    __tablename__ = 'sports'

    sport_id: Mapped[UUID] = mapped_column(primary_key=True)
    sport_name: Mapped[str] = mapped_column(String(50))