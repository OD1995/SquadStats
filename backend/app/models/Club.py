from uuid import UUID, uuid4
from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Club(db.Model):
    __tablename__ = 'clubs'

    club_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_name: Mapped[str] = mapped_column(String(50))

    def __init__(
        self,
        club_name: str
    ):
        self.club_id = uuid4()
        self.club_name = club_name