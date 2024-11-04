from datetime import datetime, timezone
from sqlalchemy.types import UUID
from sqlalchemy import ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

class ClubAdmin(Base):
    __tablename__ = 'club_admins'
    __table_args__ = {"mysql_engine": "InnoDB"}

    club_id: Mapped[UUID] = mapped_column(
        ForeignKey("clubs.club_id", name='fk_clubs_club_id'),
        index=True,
        primary_key=True
    )
    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.user_id", name='fk_users_user_id'),
        index=True,
        primary_key=True
    )
    time_created: Mapped[datetime]

    def __init__(
        self,
        club_id: UUID,
        user_id: UUID
    ):
        self.club_id = club_id
        self.user_id = user_id
        self.time_created = datetime.now(timezone.utc)