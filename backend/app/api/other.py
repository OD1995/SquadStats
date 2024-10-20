from flask import Blueprint, jsonify
from app import db
from app.models.AbrordobMarker import AbrordobMarker

other_bp = Blueprint(
    "other",
    url_prefix="/other",
    import_name=__name__
)

@other_bp.route("/abrordob-markers")
def get_abrordob_markers():
    abrordob_markers = AbrordobMarker.query.all()
    return jsonify(abrordob_markers)
    # return 1