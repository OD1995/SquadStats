import colorsys


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