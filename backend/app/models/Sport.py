from sqlalchemy import String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from app.types.enums import DataSource

class Sport(Base):
    __tablename__ = 'sports'
    __table_args__ = {"mysql_engine": "InnoDB"}

    sport_id: Mapped[DataSource] = mapped_column(primary_key=True)
    sport_name: Mapped[str] = mapped_column(String(50))