from dataclasses import dataclass
from sqlalchemy import Enum, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from app.types.enums import DataSource as DataSourceEnum

@dataclass
class DataSource(Base):
    __tablename__ = 'data_sources'
    __table_args__ = {"mysql_engine": "InnoDB"}

    data_source_id: Mapped[DataSourceEnum] = mapped_column(
        Enum(DataSourceEnum),
        primary_key=True
    )
    data_source_name: Mapped[str] = mapped_column(String(50))
    url: Mapped[str] = mapped_column(String(100), nullable=True)