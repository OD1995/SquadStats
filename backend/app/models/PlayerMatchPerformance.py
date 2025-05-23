from dataclasses import dataclass
from uuid import UUID
from sqlalchemy import ForeignKey
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.Metric import Metric
from app.models.Player import Player

@dataclass
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
    player: Mapped[Player] = relationship(lazy='joined')
    metric: Mapped[Metric] = relationship(lazy='joined')

    def __init__(
        self,
        player_id:UUID,
        match_id:UUID,
        metric_id:UUID,
        value:float
    ):
        self.player_id = player_id
        self.match_id = match_id
        self.metric_id = metric_id
        self.value = value

    def get_dict(self):
        return {
            'player' : self.player.to_dict(),
            'metric' : self.metric.metric_name,
            'value' : self.value
        }