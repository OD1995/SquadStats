from flask import Flask
from src.scraping.seasons.FootballAssociationSeasonScraper import FootballAssociationSeasonScraper

app = Flask(__name__)

@app.route("/test")
def hello_world():
    season_scraper = FootballAssociationSeasonScraper(
        external_season_id="438891715",
        external_team_id=241558678
    )
    fixture_ids = season_scraper.get_result_fixture_ids()
    return fixture_ids