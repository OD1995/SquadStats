import colorsys
import traceback
from sentry_sdk import capture_message
from app.types.enums import Metric


def build_url_using_params(
    url:str,
    params:dict
):
    return url + "?" + "&".join([
        f"{k}={v}"
        for k,v in params.items()
    ])


def is_other_result_type(
    text:str|None
):
    if text is None:
        return False
    other_result_types = [
        'Walkover',
        'Postponed'
    ]
    text_lower = text.lower()
    for ort in other_result_types:
        if ort.lower() in text_lower:
            return True
    return False

def get_colour(red_to_green):
    assert 0 <= red_to_green <= 1
    # in HSV, red is 0 deg and green is 120 deg (out of 360);
    # divide red_to_green with 3 to map [0, 1] to [0, 1./3.]
    hue = red_to_green / 3.0
    r, g, b = colorsys.hsv_to_rgb(hue, 1, 1)
    args = map(lambda x: str(int(255 * x)), (r, g, b))
    return f"rgb({','.join(args)})"

def get_unappearance_metrics():
    mets = [
        Metric.BENCH_UNUSED
    ]
    return [m.value for m in mets]

def get_goal_metrics():
    mets = [
        Metric.OVERALL_GOALS,
        Metric.GOALS
    ]
    return [m.value for m in mets]

def get_potm_metrics():
    mets = [
        Metric.POTM,
        Metric.PLAYER_OF_MATCH
    ]
    return [m.value for m in mets]

def none_of_list1_in_list2(list1,list2):
    for el in list1:
        if el in list2:
            return False
    return True

def do_error_handling(e):
    error_message = traceback.format_exc()
    capture_message(
        message=error_message,
        level='error'
    )
    return {
        'message' : error_message
    }, 400