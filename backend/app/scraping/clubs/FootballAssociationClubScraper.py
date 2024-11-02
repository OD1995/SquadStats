from app.scraping.clubs.ClubScraper import ClubScraper


class FootballAssociationClubScraper(ClubScraper):

    def __init__(
        self,
        club_id: str
    ):
        super(ClubScraper).__init__()
        self.club_id = club_id

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
            url = f"https://fulltime.thefa.com/home/club/{self.club_id}.html"
        elif club_type == 'standalone':
            url = f"https://fulltime.thefa.com/home/club/standalone/{self.club_id}.html"
        soup = self.get_soup(url=url)
        club_name_1 = soup.find(
            'div',
            {
                'class' : 'search-term center'
            }
        ).h2.text
        club_name_2 = club_name_1.strip()
        ## Remove single quotes from before and after
        return club_name_2[1:-1]