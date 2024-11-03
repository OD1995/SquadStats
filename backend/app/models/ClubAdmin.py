from datetime import date, datetime, timezone
from uuid import UUID
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class ClubAdmin(db.Model):
    __tablename__ = 'club_admins'

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