from uuid import UUID
from sqlalchemy import ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

class PlayerMatchPerformance(Base):
    __tablename__ = "player_match_performances"
    __table_args__ = {"mysql_engine": "InnoDB"}

    player_id: Mapped[UUID] = mapped_column(
        ForeignKey("players.player_id", name='fk_players_player_id'), 
        primary_key=True,
        index=True
    )
    match_id: Mapped[UUID] = mapped_column(
        ForeignKey("matches.match_id", name="fk_matches_match_id"),
        primary_key=True,
        index=True
    )
    metric_id: Mapped[UUID] = mapped_column(
        ForeignKey("metrics.metric_id", name="fk_metrics_metric_id"),
        primary_key=True,
        index=True
    )
    value: Mapped[float]