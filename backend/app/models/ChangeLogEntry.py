from dataclasses import dataclass
from uuid import UUID, uuid4
from sqlalchemy import String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column
from datetime import date as dateDT

@dataclass
class ChangeLogEntry(Base):
    __tablename__ = "change_log_entries"
    __table_args__ = {"mysql_engine": "InnoDB"}
    
    change_log_entry_id: Mapped[UUID] = mapped_column(primary_key=True)
    date: Mapped[dateDT] = mapped_column(nullable=True)
    text: Mapped[str] = mapped_column(String(16383), nullable=True)

    def __init__(
        self,
        date:dateDT,
        text:str
    ):
        self.change_log_entry_id = uuid4()
        self.date = date
        self.text = text

    def to_dict(self):
        return {
            "change_log_entry_id" : self.change_log_entry_id,
            "date" : self.date.strftime("%d %b %y"),
            "text" : self.text
        }