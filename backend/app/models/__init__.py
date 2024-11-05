from sqlalchemy.orm import declarative_base#, scoped_session, sessionmaker
# from app import db

Base = declarative_base()
# SessionLocal = scoped_session(
#     sessionmaker(
#         bind=db.engine
#     )
# )
# Base.query = SessionLocal.query_property()