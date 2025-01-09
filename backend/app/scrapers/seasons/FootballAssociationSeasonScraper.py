import asyncio
from concurrent.futures import ThreadPoolExecutor
from multiprocessing import Pool
import aiohttp
from bs4 import BeautifulSoup
from app.scrapers.fixtures.FootballAssociationFixtureScraper import FootballAssociationFixtureScraper
from app.scrapers.seasons.SeasonScraper import SeasonScraper

class FootballAssociationSeasonScraper(SeasonScraper):

    def __init__(
        self,
        external_season_id:str,
        external_team_id:str,
        team_names
    ):
        self.external_season_id = external_season_id
        self.external_team_id = external_team_id
        self.fixture_ids = self.get_result_fixture_ids()#[:5]
        self.team_names = team_names

    def __build_results_url(self):
        results_url = "https://fulltime.thefa.com/results/1/100.html?"
        query_params = {
            "selectedSeason" : self.external_season_id,
            "selectedFixtureGroupAgeGroup" : 0,
            "selectedFixtureGroupKey" : "",
            "selectedDateCode" : "all",
            "selectedRelatedFixtureOption" : 2,
            "selectedTeam" : self.external_team_id
        }
        for k,v in query_params.items():
            results_url += f"&{k}={v}"
        return results_url
    
    def go_get_data(self,fixture_id):
        soup = self.get_soup(
                f"https://fulltime.thefa.com/displayFixture.html?id={fixture_id}"
            )
        fixture_scraper = FootballAssociationFixtureScraper(
            soup,
            self.team_names
        )
        return fixture_scraper.scrape()
    
    async def go_get_data_async(self,session,fixture_id):
        async with session.get(
            f"https://fulltime.thefa.com/displayFixture.html?id={fixture_id}"
        ) as response:
            txt = await response.text()
            soup = BeautifulSoup(txt, 'html.parser')
        fixture_scraper = FootballAssociationFixtureScraper(
            soup,
            self.team_names
        )
        return fixture_scraper.scrape()
    
    def scrape_season_fixtures_synchronous(self):
        data = []
        for fixture_id in self.fixture_ids:            
            data.append(self.go_get_data(fixture_id))
        return data
    
    def scrape_season_fixtures_multiprocessing(self):
        with Pool() as pool:
            a = ((fx) for fx in self.fixture_ids)
            data = pool.map(
                self.go_get_data,
                a
            )
        return data
    
    def scrape_season_fixtures_multithreading(self):
        with ThreadPoolExecutor(max_workers=len(self.fixture_ids)) as executor:
            data = executor.map(
                self.go_get_data,
                self.fixture_ids
            )
        return data
    
    async def scrape_season_fixtures_asyncio(self):
        async with aiohttp.ClientSession() as session:
            tasks = [
                self.go_get_data_async(session, fixture_id)
                for fixture_id in self.fixture_ids
            ]
            return await asyncio.gather(*tasks)


    def get_result_fixture_ids(self):
        results_soup = self.get_soup(self.__build_results_url())
        result_fixture_ids = []
        for div in results_soup.find_all(
            'div',
            {'class' : 'datetime-col'}
        ):
            if div.a is not None:
                result_fixture_ids.append(
                    self.get_fixture_id_from_div(div)
                )
        return result_fixture_ids

    def get_fixture_id_from_div(self, div):
        link = div.a['href']
        return link.split("=")[-1]