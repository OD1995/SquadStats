from app import db
from app.models import Base

class QueryBuilder:

    def __init__(
        self,
        init
    ):
        # self.query = db.session.query(init)
        self.query = init

    def add_join(
        self,
        join_model
    ):
        self.query = self.query.join(join_model)

    def add_filter(
        self,
        filter
    ):
        self.query = self.query.filter(filter)

    def limit(
        self,
        limit
    ):
        if limit is not None:
            self.query = self.query.limit(limit)

    def order_by(
        self,
        order_by_list=[]
    ):
        if len(order_by_list) > 0:
            self.query = self.query.order_by(*order_by_list)

    def all(self):
        return self.query.all()