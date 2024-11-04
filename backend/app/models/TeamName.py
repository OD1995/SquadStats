from sqlalchemy import String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID

class TeamName(Base):
    __tablename__ = "team_names"
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    team_id: Mapped[UUID] = mapped_column(primary_key=True)
    team_name: Mapped[str] = mapped_column(String(50))
    is_default_name: Mapped[bool]