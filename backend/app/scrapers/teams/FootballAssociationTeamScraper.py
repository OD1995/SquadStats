from aiohttp import ClientSession
from sqlalchemy import false
from app.scrapers.teams.TeamScraper import TeamScraper


class FootballAssociationTeamScraper(TeamScraper):

    def __init__(
        self,
        fa_team_id:str,
        fa_league_id:str,
        fa_base_url:str
    ):
        self.fa_team_id = fa_team_id
        self.fa_league_id = fa_league_id
        self.fa_base_url = fa_base_url

    async def is_team_valid(
        self,
        session:ClientSession
    ):
        url = f"{self.fa_base_url}/displayTeam.html?teamID={self.fa_team_id}&league={self.fa_league_id}"
        async with session.get(url) as response:
            response_text = await response.text()
            better_response_text = response_text.replace("\t","").replace("\n","").replace("\r","")
            error_text = "We apologise for the inconvenience, but we are unable to process your request at this time"
            return error_text not in better_response_text