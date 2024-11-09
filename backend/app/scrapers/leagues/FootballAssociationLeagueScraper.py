from uuid import UUID
from aiohttp import ClientSession
from bs4 import BeautifulSoup
from app.models.LeagueSeason import LeagueSeason
from app.scrapers.leagues.LeagueScraper import LeagueScraper


class FootballAssociationLeagueScraper(LeagueScraper):
    
    def __init__(
        self,
        fa_league_id:str,
        fa_base_url:str
    ):
        super(LeagueScraper).__init__()
        self.fa_league_id = fa_league_id
        self.fa_base_url = fa_base_url

    def get_league_name(self):
        soup = self.get_soup(
            f"https://fulltime.thefa.com/contact.html?league={self.fa_league_id}"
        )
        league_name = soup.find(
            'div',
            attrs={
                'class' : 'league-name'
            }
        ).h1.text.strip()
        return league_name
    
    async def get_league_seasons(
        self,
        session:ClientSession,
        league_id:UUID
    ):
        url = f"{self.fa_base_url}/results.html?league={self.fa_league_id}"
        async with session.get(url) as response:
            response_text = await response.text()
            soup = BeautifulSoup(response_text, 'html.parser')
        select_element = soup.find(
            'select',
            attrs={
                'name' : 'selectedSeason'
            }
        )
        league_seasons = []
        for option_element in select_element.find_all('option'):
            league_seasons.append(
                LeagueSeason(
                    league_id=league_id,
                    data_source_league_season_id=option_element['value'],
                    data_source_season_name=option_element.text.strip()
                )
            )
        return league_seasons