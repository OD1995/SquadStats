from datetime import datetime, timezone
from sqlalchemy import String
from app import db, guard
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID, uuid4

from app.models.Club import Club
from app.models.ClubAdmin import ClubAdmin

class User(db.Model):
    __tablename__ = 'users'

    user_id: Mapped[UUID] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(130))
    time_created: Mapped[datetime]

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
        return cls.query.filter_by(email=email).one_or_none()
    
    @classmethod
    def identify(cls, user_id):
        return cls.query.get(user_id)
    
    @property
    def identity(self):
        return str(self.user_id)
    
    @property
    def rolenames(self):
        return []
    
    def get_clubs(self):
        return db.session \
            .query(Club) \
            .join(ClubAdmin) \
            .filter(ClubAdmin.user_id == self.user_id) \
            .all()

    def get_ss_user_data(self):
        return {
            'access_token' : guard.encode_jwt_token(self),
            'clubs' : self.get_clubs()
        }