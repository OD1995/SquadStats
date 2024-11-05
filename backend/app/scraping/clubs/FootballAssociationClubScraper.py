from uuid import UUID
from app.models.Team import Team
from app.models.TeamName import TeamName
from app.scraping.clubs.ClubScraper import ClubScraper
from app.types.enums import Sport


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
        new_teams = {}
        new_team_names = {}
        for team_div in team_divs:
            link = team_div.a['href']
            _,after_qm = link.split("?")
            team_section,league_section = after_qm.split("&")
            _,team_id = team_section.split("=")
            _,league_id = league_section.split("=")
            if team_id not in new_teams:
                team = Team(
                    club_id=ss_club_id,
                    sport_id=Sport.FOOTBALL,
                    data_source_team_id=team_id
                )
                team_name_str = team_div.a.p.text.strip()
                team_name = TeamName(
                    team_id=team.team_id,
                    team_name=team_name_str,
                    is_default_name=True
                )
                new_teams[team_id] = team
                new_team_names[team_id] = team_name
        return (
            list(new_teams.values()),
            list(new_team_names.values())
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