from app.scrapers.Scraper import Scraper

class FixtureScraper(Scraper):

    def __init__(self):
        pass

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