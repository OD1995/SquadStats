from uuid import UUID, uuid4
from sqlalchemy import ForeignKey, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

class Metric(Base):
    __tablename__ = 'metrics'
    __table_args__ = {"mysql_engine": "InnoDB"}

    metric_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_id: Mapped[UUID] = mapped_column(
        ForeignKey("data_sources.data_source_id", name="fk_data_sources_data_source_id"),
        index=True
    )
    metric_name: Mapped[str] = mapped_column(String(50))
    better_metric_name: Mapped[str] = mapped_column(String(50), nullable=True)

    def __init__(
        self,
        data_source_id:UUID,
        metric_name:str
    ):
        self.metric_id = uuid4()
        self.data_source_id = data_source_id
        self.metric_name = metric_name
        self.better_metric_name = None

    def get_best_metric_name(self):
        return self.better_metric_name or self.metric_name