from uuid import UUID
from aiohttp import ClientSession
from app import db
from app.helpers.misc import build_url_using_params
from app.models.Match import Match
from app.scrapers.matches.FootballAssociationMatchRow import FootballAssociationMatchRow
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
            error_texts = [
                "We apologise for the inconvenience, but we are unable to process your request at this time",
                "404 - Error"
            ]
            for error_text in error_texts:
                if error_text in better_response_text:
                    return False
            return True
        
    def get_team_matches(
        self,
        fa_season_id:str,
        team_names:list[str],
        team_season_id:UUID
    ):
        params = {
            'selectedSeason' : fa_season_id,
            'selectedFixtureGroupAgeGroup' : 0,
            'previousSelectedFixtureGroupAgeGroup' : '',
            'selectedFixtureGroupKey' : '',
            'previousSelectedFixtureGroupKey' : '',
            'selectedDateCode' : 'all',
            'selectedRelatedFixtureOption' : 2,
            'selectedClub' : "",
            'previousSelectedClub' : "",
            'selectedTeam' : self.fa_team_id,
        }
        soup = self.get_soup(
            build_url_using_params(
                f"{self.fa_base_url}/results/1/100.html",
                params
            )
        )
        tbody = soup.find(
            'div',
            attrs={
                'class' : 'tbody'
            }
        )
        fixture_divs = tbody.find_all(
            'div',
            id=lambda x: x and x.startswith('fixture-')
        )
        new_matches = []
        for fixture_div in fixture_divs:
            match_row = FootballAssociationMatchRow(
                match_div=fixture_div,
                team_names=team_names
            )
            new_match = Match(
                data_source_match_id=match_row.get_fa_match_id(),
                competition_id=None,
                team_season_id=team_season_id,
                competition_acronym=match_row.get_competition_acronym(),
                goals_for=match_row.get_goals_for(),
                goals_against=match_row.get_goals_against(),
                goal_difference=match_row.get_goal_difference(),
                pens_for=match_row.get_pens_for(),
                pens_against=match_row.get_pens_against(),
                opposition_team_name=match_row.get_oppo_team_name(),
                result=match_row.get_result(),
                date=match_row.get_date(),
                time=match_row.get_time(),
                location=None,
                home_away_neutral=match_row.get_home_away_neutral()
            )
            new_matches.append(new_match)
        old_matches = db.session.query(Match) \
            .filter_by(team_season_id=team_season_id)
        return new_matches, old_matches