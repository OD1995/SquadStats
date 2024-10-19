from uuid import UUID
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Metric(db.Model):
    __tablename__ = 'metrics'

    metric_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_id: Mapped[UUID] = mapped_column(ForeignKey("data_sources.data_source_id"))
    metric_name: Mapped[str] = mapped_column(String(50))