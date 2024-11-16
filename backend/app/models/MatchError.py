from dataclasses import dataclass
from uuid import UUID, uuid4
from sqlalchemy import String, ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

@dataclass
class MatchError(Base):
    __tablename__ = 'match_errors'
    __table_args__ = {"mysql_engine": "InnoDB"}

    match_error_id: Mapped[UUID] = mapped_column(primary_key=True)
    match_id: Mapped[UUID] = mapped_column(
        ForeignKey("matches.match_id", name='fk_matches_match_id'),
        index=True
    )
    error_message: Mapped[str] = mapped_column(String(10000))

    def __init__(
        self,
        match_id:UUID,
        error_message:str
    ):
        self.match_error_id = uuid4()
        self.match_id = match_id
        self.error_message = error_message