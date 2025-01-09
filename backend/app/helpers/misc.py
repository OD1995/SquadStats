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