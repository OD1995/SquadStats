from random import randint
from flask import Blueprint, jsonify
from app import db
from app.models.AbrordobMarker import AbrordobMarker

other_bp = Blueprint(
    "other",
    url_prefix="/other",
    import_name=__name__
)

@other_bp.route("/abrordob-markers", methods=['GET'])
def get_abrordob_markers():
    abrordob_markers = db.session.query(AbrordobMarker).all()
    return jsonify(abrordob_markers)

@other_bp.route("/random", methods=['GET'])
def random():
    return {
        'title' : 'This Is Some Random Data',
        'column_headers' : [
            'Column 1',
            'Column 2',
            'Column 3',
        ],
        'rows' : [
            [randint(0,10) for i in range(3)]
            for j in range(50)
        ]
    }