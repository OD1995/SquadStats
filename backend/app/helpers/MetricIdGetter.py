from app import db
from app.models.Metric import Metric
from app.types.enums import DataSource

class MetricIdGetter:

    def __init__(
        self,
        metric_list,
        data_source=None
    ):
        self.metric_list = metric_list
        self.data_source = data_source

    def get_metric_ids_dict(self):
        return_me = {}
        metrics_query = db.session.query(Metric) \
            .filter(Metric.metric_name.in_(self.metric_list))
        if (self.data_source is not None):
            metrics_query = metrics_query.filter(Metric.data_source_id==DataSource.MANUAL)
        for metric in metrics_query:
            return_me[metric.get_best_metric_name()] = metric.metric_id
        return return_me