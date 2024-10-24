from uuid import UUID
from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class DataSource(db.Model):
    __tablename__ = 'data_sources'

    data_source_id: Mapped[UUID] = mapped_column(primary_key=True)
    data_source_name: Mapped[str] = mapped_column(String(50))
    url: Mapped[str] = mapped_column(String(100))