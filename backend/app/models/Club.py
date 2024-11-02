from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column
from dataclasses import dataclass

@dataclass
class Club(db.Model):
    __tablename__ = 'clubs'

    club_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_name: Mapped[str] = mapped_column(String(50))
    data_source_club_id: Mapped[str] = mapped_column(String(50), nullable=True)
    time_created: Mapped[datetime]

    def __init__(
        self,
        club_name: str,
        data_source_club_id: str|None
    ):
        self.club_id = uuid4()
        self.club_name = club_name
        self.data_source_club_id = data_source_club_id
        self.time_created = datetime.now(timezone.utc)