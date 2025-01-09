from uuid import UUID
from aiohttp import ClientSession
from app.scrapers.fixtures.FixtureScraper import FixtureScraper
from bs4 import BeautifulSoup
from datetime import datetime

class FootballAssociationFixtureScraper(FixtureScraper):

    def __init__(
        self,
        # soup,
        fixture_id:str,
        team_names:list[str]
    ):
        super(FixtureScraper).__init__()
        self.fixture_id = fixture_id
        self.team_names = team_names
        # self.soup = soup
        self.expected_column_headers = [
            'Time',
            'Team',
            'Player',
            'Stat',
            ''
        ]

    def build_url(self) -> str:
        return f"https://fulltime.thefa.com/displayFixture.html?id={self.fixture_id}"
    
    async def scrape_fixture(
        self,
        session:ClientSession,
        match_id:UUID
    ):
        match_errors = []
        player_data = {}
        match_info = {}
        response_text = ""
        soup = None
        try:
            async with session.get(self.build_url()) as response:
                try:
                    response_text = await response.text()
                except Exception as e:
                    match_errors.append(repr(e)[:10000])
                
                try:
                    soup = BeautifulSoup(response_text, 'html.parser')
                except Exception as e:
                    match_errors.append(repr(e)[:10000])
                
                try:
                    player_data = self.get_player_data(soup)
                except Exception as e:
                    match_errors.append(repr(e)[:10000])
                
                try:
                    match_info = self.get_match_info(soup)
                except Exception as e:
                    match_errors.append(repr(e)[:10000])
        except Exception as e:
            match_errors.append(repr(e)[:10000])
        return {
            "player_data" : player_data,
            "match_info" : match_info,
            "match_errors" : match_errors,
            'match_id' : match_id
        }
    
    def get_match_info(
        self,
        soup:BeautifulSoup
    ) -> dict:
        fixture_details_section = soup.find("section", {"id" : "fixture-details"})
        fixture_date_time_div = fixture_details_section.find(
            "div",
            {"class" : "fixture-date-time"}
        )
        date,time,location = [
            x.text.strip()
            for x in fixture_date_time_div.find_all('div')
        ]
        return {
            "location" : location.strip(),
        }

    def get_player_data(
        self,
        soup:BeautifulSoup
    ) -> dict:
        table_section = soup.find("section", {"id" : "fixture-details"})
        table_div = table_section.find("div", {"class" : "padding-bottom divider"})
        if table_div is None:
            return {}
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
        performances = {}
        for row in table.tbody.find_all('tr'):
            (
                time,
                team,
                player,
                stat,
                value
            ) = [
                x.text.strip()
                for x in row.find_all('td')
            ]
            if team not in self.team_names:
                continue
            pmp = performances.get(player, {})
            if stat in pmp:
                pmp[stat] += float(value)
            else:
                pmp[stat] = float(value)
            performances[player] = pmp
        return performances