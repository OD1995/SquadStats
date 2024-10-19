from scraping.fixtures import FootballAssociationFixtureScraper
from scraping.seasons import FootballAssociationSeasonScraper

season_scraper = FootballAssociationSeasonScraper(
    external_season_id="438891715",
    external_team_id=241558678
)
fixture_ids = season_scraper.get_result_fixture_ids()
a=1

# url = "https://fulltime.thefa.com/fixtures.html?"
# url += "selectedSeason=66783998"
# url += "&selectedFixtureGroupKey=1_376560186"
# url += "&selectedDateCode=all"
# url += "&selectedClub=220678617"
# url += "&selectedTeam=241558678"
# url += "&selectedRelatedFixtureOption=3"
# url += "&selectedFixtureDateStatus="
# url += "&selectedFixtureStatus="
# url += "&previousSelectedFixtureGroupAgeGroup="
# url += "&previousSelectedFixtureGroupKey=1_376560186"
# url += "&previousSelectedClub=220678617"
# url += "&itemsPerPage=25"


# team_id = 241558678
# team_obj = Team(team_id)
# team_names = team_obj.get_team_names()
team_names = [
    "Alexandra Park 4th",
    "Alexandra Park Fourth"
]

fixture_scraper = FootballAssociationFixtureScraper(
    fixture_id=26345485,
    team_names=team_names
)
res = fixture_scraper.scrape()
a=1