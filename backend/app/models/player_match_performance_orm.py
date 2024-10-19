from sqlalchemy import Column, Float, String, Table, Uuid
from app.models import metadata

# - player_id : player_id
# - match_id : match_id
# - metric : metric_id
# - value : float
player_match_performances = Table(
    "player_match_performances",
    metadata,
    Column("player_id", Uuid),
    Column("match_id", Uuid),
    Column("metric", Uuid),
    Column("value", Float)
)