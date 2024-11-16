def build_url_using_params(
    url:str,
    params:dict
):
    return url + "?" + "&".join([
        f"{k}={v}"
        for k,v in params.items()
    ])