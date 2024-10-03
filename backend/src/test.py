from scraping.FootballAssociationFixtureScraper import FootballAssociationFixtureScraper

# team_id = 241558678
# team_obj = Team(team_id)
# team_names = team_obj.get_team_names()
team_names = [
    "Alexandra Park 4th",
    "Alexandra Park Fourth"
]

fixture = FootballAssociationFixtureScraper(
    26345485,
    team_names
)
res = fixture.scrape()
a=1