from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column
# from sqlalchemy.ext.declarative import declarative_base
from uuid import UUID

# Base = declarative_base()

class TeamName(db.Model):
    __tablename__ = "team_names"
    
    team_id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    default_name: Mapped[bool]