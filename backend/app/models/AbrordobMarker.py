from sqlalchemy import String
from app import db
# import sqlalchemy.orm as so
from sqlalchemy.orm import Mapped, mapped_column
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()

class AbrordobMarker(db.Model):
    __tablename__ = "abrordob_markers"
    
    marker_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    colour: Mapped[str] = mapped_column(String(20))
    latitude: Mapped[float]
    longitude: Mapped[float]
    text: Mapped[str] = mapped_column(String(16383))