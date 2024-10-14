from src.scraping.fixtures.FixtureScraper import FixtureScraper
from bs4 import BeautifulSoup
from datetime import datetime

class FootballAssociationFixtureScraper(FixtureScraper):

    def __init__(
        self,
        soup,
        # fixture_id:str,
        team_names:list[str]
    ):
        super(FixtureScraper).__init__()
        # self.fixture_id = fixture_id
        self.team_names = team_names
        self.soup = soup
        self.expected_column_headers = [
            'Time',
            'Team',
            'Player',
            'Stat',
            ''
        ]

    def build_url(self) -> str:
        return f"https://fulltime.thefa.com/displayFixture.html?id={self.fixture_id}"
    
    def scrape(self):
        # soup = self.get_soup(self.build_url())
        return {
            "player_data" : self.get_player_data(self.soup),
            "match_info" : self.get_match_info(self.soup)
        }
    
    def get_match_info(
        self,
        soup:BeautifulSoup
    ) -> dict:
        fixture_details_section = soup.find("section", {"id" : "fixture-details"})
        competition_name = fixture_details_section.find(
            "div",
            {"class" : "fa-county-details"}
        ).text.strip()
        fixture_date_time_div = fixture_details_section.find(
            "div",
            {"class" : "fixture-date-time"}
        )
        date,time,location = [
            x.text.strip()
            for x in fixture_date_time_div.find_all('div')
        ]
        result_info = {}
        fixture_team_score_div = fixture_details_section.find(
            "div",
            {"class" : "fixture-teams-and-score"}
        )
        scores = [
            x.text
            for x in fixture_team_score_div.find(
                'div',
                {'class' : 'score-container'}
            ).find_all('p')
        ]
        for ix,loc in enumerate(['home','road']):
            loc_team_div = fixture_team_score_div.find(
                'div',
                {'class' : f"{loc}-team"}
            )
            team_name = loc_team_div.find(
                'div',
                {'class' : 'team-name'}
            ).text.strip()
            result_info[f"{loc}_team_name"] = team_name
            result_info[f"{loc}_score"] = int(scores[ix])
        is_home_team = result_info['home_team_name'] in self.team_names
        goals_for = result_info['home_score'] if is_home_team  else result_info['road_score']
        goals_against = result_info['home_score'] if not is_home_team  else result_info['road_score']
        goal_difference = goals_for - goals_against
        opposition = result_info['home_team_name'] if not is_home_team  else result_info['road_team_name']
        result = self.get_result(
            is_home_team,
            goals_for,
            goals_against
        )
        home_away_neutral = "H" if is_home_team else "A"
        return {
            "competition_name" : competition_name,
            "date" : datetime.strptime(date,"%d/%m/%y").date(),
            "time" : datetime.strptime(time,"%H:%M").time(),
            "location" : location.strip(),
            "goals_for" : goals_for,
            "goals_against" : goals_against,
            "goal_difference" : goal_difference,
            "opposition" : opposition,
            "result" : result,
            "home_away_neutral" : home_away_neutral
        }

    def get_player_data(
        self,
        soup:BeautifulSoup
    ) -> dict:
        table_section = soup.find("section", {"id" : "fixture-details"})
        table_div = table_section.find("div", {"class" : "padding-bottom divider"})
        table = table_div.find("table", {"class" : "cell-dividers"})
        column_headers = [
            x.text
            for x in table.thead.tr.find_all('th')
        ]
        if column_headers != self.expected_column_headers:
            expected_columns_str = ",".join(self.expected_column_headers)
            unexpected_columns_str = ",".join(column_headers)
            txt = f"Unexpected columns for {self.fixture_id}."
            txt += f" Expected columns: `{expected_columns_str}`."
            txt += f" Unexpected columns: `{unexpected_columns_str}`"
            raise Exception(txt)
        performances = {}
        for row in table.tbody.find_all('tr'):
            (
                time,
                team,
                player,
                stat,
                value
            ) = [
                x.text
                for x in row.find_all('td')
            ]
            if team not in self.team_names:
                continue
            pmp = performances.get(player, {})
            pmp[stat] = value
            performances[player] = pmp
        return performances