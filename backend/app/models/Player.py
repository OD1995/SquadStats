from uuid import UUID
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Player(db.Model):
    __tablename__ = 'players'

    player_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_id: Mapped[UUID] = mapped_column(
        ForeignKey("clubs.club_id", name='fk_clubs_club_id'),
        index=True
    )
    data_source_player_name: Mapped[str] = mapped_column(String(100))
    better_player_name: Mapped[str] = mapped_column(String(100))