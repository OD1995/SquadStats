from dataclasses import dataclass
from sqlalchemy import Enum, String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from app.types.enums import Sport as SportEnum

@dataclass
class Sport(Base):
    __tablename__ = 'sports'
    __table_args__ = {"mysql_engine": "InnoDB"}

    sport_id: Mapped[SportEnum] = mapped_column(
        Enum(SportEnum),
        primary_key=True
    )
    sport_name: Mapped[str] = mapped_column(String(50))