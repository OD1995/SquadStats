from uuid import UUID, uuid4
from sqlalchemy import String
from app.models import Base
from sqlalchemy.orm import Mapped, mapped_column

class MatchReport(Base):
    __tablename__ = 'match_reports'
    __table_args__ = {"mysql_engine": "InnoDB"}

    match_report_id: Mapped[UUID] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(String(16383), nullable=True)
    image_ids: Mapped[str] = mapped_column(String(1000), nullable=True)

    def __init__(
        self,
        text:str|None,
        image_ids:list[str],
        match_report_id:UUID|None=None,
    ):
        self.match_report_id = match_report_id or uuid4()
        self.text = text
        self.image_ids = None if len(image_ids) == 0 else ",".join([str(x) for x in image_ids])