import requests
from bs4 import BeautifulSoup

class FixtureScraper:

    def __init__(self):
        pass

    def get_soup(
        self,
        url:str
    ) -> BeautifulSoup:
        req = requests.get(url)
        if req.ok:
            return BeautifulSoup(req.text, 'html.parser')
        return Exception(f"Status Code: {req.status_code} - Text: {req.text}")

    def save_data(data):
        pass

    def get_result(
        self,
        is_home_team:bool,
        home_score:int,
        away_score:int
    ):
        if home_score == away_score:
            return "D"
        if home_score > away_score:
            return "W" if is_home_team else "L"
        return "L" if is_home_team else "W"