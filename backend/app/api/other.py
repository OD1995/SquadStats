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

    def createRow(column_headers):
        return {
            ch : randint(0,10)
            for ch in column_headers
        }
    
    column_headers = [
        'Column 1',
        'Column 2',
        'Column 3',
    ]
    return {
        'title' : 'This Is Some Random Data',
        'column_headers' : column_headers,
        'rows' : [
            createRow(column_headers)
            for j in range(50)
        ]
    }