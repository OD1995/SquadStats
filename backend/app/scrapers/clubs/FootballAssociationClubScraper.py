import asyncio
from uuid import UUID

import aiohttp
from app.models.League import League
from app.models.Team import Team
from app.models.TeamLeague import TeamLeague
from app.models.TeamName import TeamName
from app.scrapers.clubs.ClubScraper import ClubScraper
from app.scrapers.leagues.FootballAssociationLeagueScraper import FootballAssociationLeagueScraper
from app.scrapers.teams.FootballAssociationTeamScraper import FootballAssociationTeamScraper
from app.types.enums import DataSource, Sport


class FootballAssociationClubScraper(ClubScraper):

    def __init__(
        self,
        fa_club_id:str,
        fa_base_url:str
    ):
        super(ClubScraper).__init__()
        self.fa_club_id = fa_club_id
        self.fa_base_url = fa_base_url
        self.soup = None

    def get_teams(
        self,
        ss_club_id:UUID
    ) -> tuple[list[Team], list[TeamName]]:
        team_divs = self.soup.find(
            'div',
            {
                'class' : 'results-container grid-3'
            }
        ).find_all('div')
        team_info_list = []
        team_scrapers = []
        for team_div in team_divs:
            link = team_div.a['href']
            _,after_qm = link.split("?")
            team_section,league_section = after_qm.split("&")
            _,data_source_team_id = team_section.split("=")
            _,data_source_league_id = league_section.split("=")
            league_name = team_div.a.strong.text.strip()
            team_name_str = team_div.a.p.text.strip()
            team_info_list.append(
                (
                    league_name,
                    data_source_league_id,
                    ss_club_id,
                    data_source_team_id,
                    team_name_str
                )
            )
            team_scrapers.append(
                FootballAssociationTeamScraper(
                    fa_team_id=data_source_team_id,
                    fa_league_id=data_source_league_id,
                    fa_base_url=self.fa_base_url
                )
            )
        team_validity = asyncio.run(
            self.get_team_validity(
                team_info_list=team_info_list,
                team_scrapers=team_scrapers
            )
        )
        new_leagues = {}
        new_teams = []
        new_team_names = []
        new_team_leagues = []
        for (
            league_name,
            data_source_league_id,
            ss_club_id,
            data_source_team_id,
            team_name_str
        ), is_valid in team_validity.items():
            if not is_valid:
                continue
            if data_source_league_id not in new_leagues:
                new_league_obj = League(
                    league_name=league_name,
                    data_source_league_id=data_source_league_id,
                    data_source_id=DataSource.FOOTBALL_ASSOCIATION
                )
                new_leagues[data_source_league_id] = new_league_obj
            league_id = new_leagues[data_source_league_id].league_id
            new_team_obj = Team(
                club_id=ss_club_id,
                sport_id=Sport.FOOTBALL,
                data_source_team_id=data_source_team_id
            )
            new_team_name_obj = TeamName(
                team_id=new_team_obj.team_id,
                team_name=team_name_str,
                is_default_name=True
            )
            new_team_league_obj = TeamLeague(
                team_id=new_team_obj.team_id,
                league_id=league_id
            )
            new_teams.append(new_team_obj)
            new_team_names.append(new_team_name_obj)
            new_team_leagues.append(new_team_league_obj)
        
        return (
            new_teams,
            new_team_names,
            new_team_leagues,
            list(new_leagues.values())
        )
    
    async def get_team_validity(
        self,
        team_info_list:list[tuple],
        team_scrapers:list[FootballAssociationTeamScraper]
    ):
        async with aiohttp.ClientSession() as session:
            tasks = [
                scraper.is_team_valid(session)
                for scraper in team_scrapers
            ]
            results = await asyncio.gather(*tasks)
        return dict(zip(team_info_list,results))

    def get_club_name(self):
        normal_club_name = self.get_name(club_type='normal')
        if normal_club_name != "":
            return normal_club_name
        return self.get_name(club_type='standalone')
        
    def get_name(
        self,
        club_type:str ## maybe this should be an enum
    ):
        if club_type == 'normal':
            url = f"{self.fa_base_url}/home/club/{self.fa_club_id}.html"
        elif club_type == 'standalone':
            url = f"{self.fa_base_url}/home/club/standalone/{self.fa_club_id}.html"
        self.soup = self.get_soup(url=url)
        club_name_1 = self.soup.find(
            'div',
            {
                'class' : 'search-term center'
            }
        ).h2.text
        club_name_2 = club_name_1.strip()
        ## Remove single quotes from before and after
        return club_name_2[1:-1]