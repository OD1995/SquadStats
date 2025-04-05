from random import randint
import traceback
from uuid import UUID
from flask import Blueprint, jsonify, request
from app import db
from app.helpers.misc import do_error_handling
from app.models.AbrordobMarker import AbrordobMarker
from app.models.ChangeLogEntry import ChangeLogEntry
from app.models.Match import Match
from app.models.MatchReport import MatchReport
from datetime import datetime

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

@other_bp.route("/set-match-report", methods=['POST'])
def set_match_report():
    req = request.get_json()
    match_id = UUID(req['match_id'])
    time_str = req['time']
    time = datetime.strptime(time_str, "%H:%M").time()
    match_report_image_ids = req['image_ids']
    match_report_obj = MatchReport(
        image_ids=match_report_image_ids,
        text=None
    )
    match_obj = db.session.query(Match) \
        .filter_by(match_id=match_id) \
        .first()
    match_obj.time = time
    match_obj.match_report_id = match_report_obj.match_report_id
    db.session.add(match_report_obj)
    db.session.merge(match_obj)
    db.session.commit()
    return jsonify({"success":True})

@other_bp.route("/set-text-match-report", methods=['POST'])
def set_text_match_report():
    req = request.get_json()
    match_id = UUID(req['match_id'])
    time_str = req['time']
    time = datetime.strptime(time_str, "%H:%M").time()
    match_report_text = req['text']
    match_report_obj = MatchReport(
        image_ids=[],
        text=match_report_text
    )
    match_obj = db.session.query(Match) \
        .filter_by(match_id=match_id) \
        .first()
    match_obj.time = time
    match_obj.match_report_id = match_report_obj.match_report_id
    db.session.add(match_report_obj)
    db.session.merge(match_obj)
    db.session.commit()
    return jsonify({"success":True})

@other_bp.route("/get-change-log", methods=['GET'])
def get_change_log():    
    try:
        change_log_entries = db.session.query(ChangeLogEntry) \
            .order_by(ChangeLogEntry.date.desc()) \
            .all()
        return jsonify([
            x.to_dict()
            for x in change_log_entries
        ])
    except Exception as e:
        return do_error_handling(e)