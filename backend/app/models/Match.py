from uuid import UUID
from datetime import date, time
from sqlalchemy import ForeignKey, String
from app import db
from sqlalchemy.orm import Mapped, mapped_column

class Match(db.Model):
    __tablename__ = 'matches'
    
    match_id: Mapped[UUID] = mapped_column(primary_key=True)
    competition_id: Mapped[UUID] = mapped_column(
        ForeignKey("competitions.competition_id", name="fk_competitions_competition_id"),
        index=True    
    )
    goals_for: Mapped[int]
    goals_against: Mapped[int]
    goal_difference: Mapped[int]
    opposition_team_name: Mapped[str] = mapped_column(String(100))
    result: Mapped[str] = mapped_column(String(1))
    date: Mapped[date]
    time: Mapped[time]
    location: Mapped[str] = mapped_column(String(100))
    home_away_neutral: Mapped[str] = mapped_column(String(1))