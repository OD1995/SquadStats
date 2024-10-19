from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID

class TeamName(db.Model):
    __tablename__ = "team_names"
    
    team_id: Mapped[UUID] = mapped_column(primary_key=True)
    team_name: Mapped[str] = mapped_column(String(50))
    is_default_name: Mapped[bool]