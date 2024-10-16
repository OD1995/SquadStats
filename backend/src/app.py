import asyncio
from time import sleep
from datetime import datetime
from flask import Flask
from src.scraping.fixtures.FootballAssociationFixtureScraper import FootballAssociationFixtureScraper
from src.scraping.seasons.FootballAssociationSeasonScraper import FootballAssociationSeasonScraper
from src.scraping.teams.FootballAssociationTeamScraper import FootballAssociationTeamScraper

app = Flask(__name__)

@app.route("/test")
def hello_world():
    # team_names = [
    #     "Alexandra Park 4th",
    #     "Alexandra Park Fourth"
    # ]
    # season_scraper = FootballAssociationSeasonScraper(
    #     external_season_id="438891715",
    #     external_team_id=241558678,
    #     team_names=team_names
    # )
    # A = datetime.now()
    # data1 = season_scraper.scrape_season_fixtures_synchronous()
    # B = datetime.now()
    # print('synchronous', B-A, len(data1))
    # sleep(10)
    # C = datetime.now()
    # data2 = season_scraper.scrape_season_fixtures_multiprocessing()
    # D = datetime.now()
    # print('multiprocessing', D-C, len(data1))
    # sleep(10)
    # E = datetime.now()
    # data3 = season_scraper.scrape_season_fixtures_multithreading()
    # F = datetime.now()
    # print('multithreading', F-E, len(data1))
    # sleep(10)
    # G = datetime.now()
    # data4 = asyncio.run(season_scraper.scrape_season_fixtures_asyncio())
    # H = datetime.now()
    # print('asyncio', H-G, len(data1))
    # print("got fixture IDs")
    # data = []
    # for fixture_id in fixture_ids:
    #     fixture_scraper = FootballAssociationFixtureScraper(
    #         fixture_id=fixture_id,
    #         team_names=team_names
    #     )
    #     data.append(fixture_scraper.scrape())
    #     print(f"{fixture_id} done")
    a = FootballAssociationTeamScraper()
    return "ok"