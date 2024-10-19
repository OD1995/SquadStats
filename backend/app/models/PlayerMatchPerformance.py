from uuid import UUID
from sqlalchemy import ForeignKey
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class PlayerMatchPerformance(db.Model):
    __tablename__ = "player_match_performances"

    player_id: Mapped[UUID] = mapped_column(ForeignKey("players.player_id"), primary_key=True)
    match_id: Mapped[UUID] = mapped_column(ForeignKey("matches.match_id"), primary_key=True)
    metric_id: Mapped[UUID] = mapped_column(ForeignKey("metrics.metric_id"), primary_key=True)
    value: Mapped[float]