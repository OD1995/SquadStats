from sqlalchemy import Enum, ForeignKey, String
from app.models import Base
from uuid import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.types.enums import DataSource as DataSourceEnum

class Season(Base):
    __tablename__ = 'seasons'
    __table_args__ = {"mysql_engine": "InnoDB"}

    season_id: Mapped[UUID] = mapped_column(primary_key=True)
    season_name: Mapped[str] = mapped_column(String(50))
    data_source_season_id: Mapped[str] = mapped_column(String(50))
    data_source_id: Mapped[DataSourceEnum] = mapped_column(
        Enum(DataSourceEnum),
        ForeignKey("data_sources.data_source_id", name='fk_data_sources_data_source_id'),
        index=True
    )