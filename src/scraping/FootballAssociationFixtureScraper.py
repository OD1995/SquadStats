from src.scraping.FixtureScraper import FixtureScraper
from bs4 import BeautifulSoup

class FootballAssociationFixtureScraper(FixtureScraper):

    def __init__(
        self,
        fixture_id:str,
        team_name:str
    ):
        super().__init__()
        self.fixture_id = fixture_id
        self.team_name = team_name
        self.expected_column_headers = [
            'Time',
            'Team',
            'Player',
            'Stat',
            ''
        ]
        self.relevant_metrics = [
            'Appearances',
            'Overall Goals',

        ]

    def build_url(self):
        return f"https://fulltime.thefa.com/displayFixture.html?id={self.fixture_id}"
    
    def scrape(self):
        soup = self.__get_soup(self.build_url())

    def get_player_data(
        self,
        soup:BeautifulSoup
    ):
        table_section = soup.find("section", {"id" : "ft-container"})
        table_div = table_section.find("div", {"class" : "padding-bottom divider"})
        table = table_div.find("table", {"class" : "cell-dividers"})
        column_headers = [
            x.text
            for x in table.thead.tr.find_all('th')
        ]
        if column_headers != self.expected_column_headers:
            expected_columns_str = ",".join(self.expected_column_headers)
            unexpected_columns_str = ",".join(column_headers)
            txt = f"Unexpected columns for {self.fixture_id}."
            txt += f" Expected columns: `{expected_columns_str}`."
            txt += f" Unexpected columns: `{unexpected_columns_str}`"
            raise Exception(txt)
        

