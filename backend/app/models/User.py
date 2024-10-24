from datetime import datetime
from sqlalchemy import String
from app import db
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID

class User(db.Model):
    __tablename__ = 'users'

    user_id: Mapped[UUID] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(50))
    time_created: Mapped[datetime]

    
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()