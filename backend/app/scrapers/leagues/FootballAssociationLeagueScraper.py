from app.scrapers.leagues.LeagueScraper import LeagueScraper


class FootballAssociationLeagueScraper(LeagueScraper):
    
    def __init__(
        self,
        fa_league_id:str
    ):
        super(LeagueScraper).__init__()
        self.fa_league_id = fa_league_id
        self.soup = None

    def get_league_name(self):
        soup = self.get_soup(
            f"https://fulltime.thefa.com/contact.html?league={self.fa_league_id}"
        )
        league_name = soup.find(
            'div',
            attrs={
                'class' : 'league-name'
            }
        ).h1.text.strip()
        return league_name