from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

class Player(Base):
    __tablename__ = 'players'
    __table_args__ = {"mysql_engine": "InnoDB"}

    player_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_id: Mapped[UUID] = mapped_column(
        ForeignKey("clubs.club_id", name='fk_clubs_club_id'),
        index=True
    )
    data_source_player_name: Mapped[str] = mapped_column(String(100))
    better_player_name: Mapped[str] = mapped_column(String(100),nullable=True)

    def __init__(
        self,
        club_id:UUID,
        data_source_player_name:str
    ):
        self.player_id = uuid4()
        self.club_id = club_id
        self.data_source_player_name = data_source_player_name
        self.better_player_name = None