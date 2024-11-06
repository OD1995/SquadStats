from uuid import UUID
from app.models.League import League
from app.models.Team import Team
from app.models.TeamLeague import TeamLeague
from app.models.TeamName import TeamName
from app.scraping.clubs.ClubScraper import ClubScraper
from app.scraping.leagues.FootballAssociationLeagueScraper import FootballAssociationLeagueScraper
from app.types.enums import DataSource, Sport


class FootballAssociationClubScraper(ClubScraper):

    def __init__(
        self,
        fa_club_id: str
    ):
        super(ClubScraper).__init__()
        self.fa_club_id = fa_club_id
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
        new_teams = []
        new_team_names = []
        new_leagues = {}
        new_team_leagues = []
        for team_div in team_divs:
            link = team_div.a['href']
            _,after_qm = link.split("?")
            team_section,league_section = after_qm.split("&")
            _,data_source_team_id = team_section.split("=")
            _,data_source_league_id = league_section.split("=")
            if data_source_league_id not in new_leagues:
                # league_scraper = FootballAssociationLeagueScraper(data_source_league_id)
                # league_name = league_scraper.get_league_name()
                league_name = team_div.a.strong.text.strip()
                new_league_obj = League(
                    league_name=league_name,
                    data_source_league_id=data_source_league_id,
                    data_source_id=DataSource.FOOTBALL_ASSOCIATION
                )
                new_leagues[data_source_league_id] = new_league
            league_id = new_leagues[data_source_league_id].league_id
            new_team_obj = Team(
                club_id=ss_club_id,
                sport_id=Sport.FOOTBALL,
                data_source_team_id=data_source_team_id
            )
            team_name_str = team_div.a.p.text.strip()
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
            url = f"https://fulltime.thefa.com/home/club/{self.fa_club_id}.html"
        elif club_type == 'standalone':
            url = f"https://fulltime.thefa.com/home/club/standalone/{self.fa_club_id}.html"
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