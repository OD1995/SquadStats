from src.scraping.teams.TeamScraper import TeamScraper


class FootballAssociationTeamScraper(TeamScraper):

    def __init__(
        self,
        external_team_id:str
    ):
        self.external_team_id = external_team_id

    def get_season_ids(self):
        pass