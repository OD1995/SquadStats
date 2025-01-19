from dataclasses import dataclass
from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

@dataclass
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

    def get_best_name(self):
        return self.better_player_name or self.data_source_player_name
    
    def to_dict(
        self,
        include_both_names=False
    ):
        D = {
            'player_id' : self.player_id,
            'player_name' : self.get_best_name(),
            'club_id' : self.club_id,
        }
        if include_both_names:
            D['data_source_player_name'] = self.data_source_player_name
            D['better_player_name'] = self.better_player_name
        return D