from random import randint
import traceback
from flask import Blueprint, jsonify
from app import db
from app.helpers.misc import do_error_handling
from app.models.AbrordobMarker import AbrordobMarker

other_bp = Blueprint(
    "other",
    url_prefix="/other",
    import_name=__name__
)

@other_bp.route("/abrordob-markers", methods=['GET'])
def get_abrordob_markers():
    try:
        abrordob_markers = db.session.query(AbrordobMarker).all()
        return jsonify(abrordob_markers)
    except Exception as e:
        return do_error_handling(e)

@other_bp.route("/test1", methods=['GET'])
def test1():
    try:
        raise Exception('this is a test')
    except Exception as e:
        return {
            'message' : traceback.format_exc()
        }, 400
    
@other_bp.route("/test2", methods=['GET'])
def test2():
    try:
        raise Exception('this is a test')
    except Exception as e:
        return do_error_handling(e)
    
@other_bp.route("/test3", methods=['GET'])
def test3():
    1/0
    return "hiya"

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