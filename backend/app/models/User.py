from datetime import datetime, timezone
from typing import List
from sqlalchemy import String
from app import db, guard
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID, uuid4
from app.models import Base
from app.models.Club import Club
from app.models.ClubAdmin import ClubAdmin


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {"mysql_engine": "InnoDB"}

    user_id: Mapped[UUID] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(130))
    time_created: Mapped[datetime]
    # clubs: Mapped[List["Club"]] = relationship(lazy='joined')

    def __init__(
        self,
        email:str,
        password:str
    ):
        self.user_id = uuid4()
        self.email = email
        self.password = password
        self.time_created = datetime.now(timezone.utc)
    
    @classmethod
    def lookup(cls, email):
        return db.session.query(cls).filter_by(email=email).one_or_none()
    
    @classmethod
    def identify(cls, user_id):
        return db.session.query(cls).get(UUID(user_id))
    
    @property
    def identity(self):
        return str(self.user_id)
    
    @property
    def rolenames(self):
        return []
    
    def get_clubs(self):
        clubs = db.session \
            .query(Club) \
            .join(ClubAdmin) \
            .filter(ClubAdmin.user_id == self.user_id) \
            .all()
        return [
            club.get_club_info()
            for club in clubs
        ]

    def get_ss_user_data(self):
        return {
            'access_token' : guard.encode_jwt_token(self),
            'clubs' : self.get_clubs()
        }