from dataclasses import dataclass
from sqlalchemy import String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

@dataclass
class AbrordobMarker(Base):
    __tablename__ = "abrordob_markers"
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    marker_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    colour: Mapped[str] = mapped_column(String(20))
    latitude: Mapped[float]
    longitude: Mapped[float]
    text: Mapped[str] = mapped_column(String(16383))
    date_time: Mapped[datetime]
    image_url_id: Mapped[str] = mapped_column(String(100))