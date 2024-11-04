from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Team(db.Model):
    __tablename__ = 'teams'

    team_id: Mapped[UUID] = mapped_column(primary_key=True)
    club_id: Mapped[UUID] = mapped_column(
        ForeignKey("clubs.club_id", name="fk_clubs_club_id"),
        index=True
    )
    sport_id: Mapped[UUID] = mapped_column(
        ForeignKey("sports.sport_id", name="fk_sports_sport_id"),
        index=True
    )
    data_source_team_id: Mapped[str] = mapped_column(String(100))

    def __init__(
        self,
        club_id:UUID,
        sport_id:UUID,
        data_source_team_id:str
    ):
        self.team_id = uuid4()
        self.club_id = club_id
        self.sport_id = sport_id
        data_source_team_id = data_source_team_id