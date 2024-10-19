from uuid import UUID
from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Club(db.Model):
    __tablename__ = 'clubs'

    club_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_name: Mapped[str] = mapped_column(String(50))