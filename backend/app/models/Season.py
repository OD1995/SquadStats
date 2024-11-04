from sqlalchemy import String
from app.models import Base
from uuid import UUID
from sqlalchemy.orm import Mapped, mapped_column

class Season(Base):
    __tablename__ = 'seasons'
    __table_args__ = {"mysql_engine": "InnoDB"}

    season_id: Mapped[UUID] = mapped_column(primary_key=True)
    season_name: Mapped[str] = mapped_column(String(50))
    data_source_season_id: Mapped[str] = mapped_column(String(50))