import asyncio
from uuid import UUID
from aiohttp import ClientSession
import aiohttp
from bs4 import BeautifulSoup
from app import db
from app.helpers.misc import build_url_using_params
from app.models.Competition import Competition
from app.models.Match import Match
from app.models.MatchError import MatchError
from app.models.Team import Team
from app.models.TeamSeason import TeamSeason
from app.scrapers.fixtures.FootballAssociationFixtureScraper import FootballAssociationFixtureScraper
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

    async def scrape_matches(
        self,
        fa_match_id_list:list[str],
        team_names:list[str],
        match_id_list:list[str]
    ):
        async with aiohttp.ClientSession() as session:
            tasks = [
                FootballAssociationFixtureScraper(
                    fixture_id=fa_match_id,
                    team_names=team_names
                ).scrape_fixture(session=session, match_id=match_id)
                for fa_match_id, match_id in zip(fa_match_id_list, match_id_list)
            ]
            return await asyncio.gather(*tasks)
        # return dict(zip(match_id_list, result))

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
        team_season_id:UUID,
        current_matches:list[Match]
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
        competition_options = self.get_competition_options(soup)
        fixture_divs = tbody.find_all(
            'div',
            id=lambda x: x and x.startswith('fixture-')
        )
        competitions = db.session.query(Competition) \
            .join(TeamSeason) \
            .join(Team) \
            .filter(Team.data_source_team_id == self.fa_team_id) \
            .all()
        competitions_by_name = {
            c.competition_name : c
            for c in competitions
        }
        still_exists = {}
        matches_by_fa_match_id = {}
        for m in current_matches:
            still_exists[m.data_source_match_id] = False
            matches_by_fa_match_id[m.data_source_match_id] = m
        new_matches = []
        new_match_errors = []
        new_competitions = []
        delete_match_errors = []
        matches_to_return = []
        for fixture_div in fixture_divs:
            match_row = FootballAssociationMatchRow(
                match_div=fixture_div,
                team_names=team_names
            )
            competition_name = match_row.get_competition_name()
            if competition_name in competitions_by_name:
                competition = competitions_by_name[competition_name]
            else:
                competition = Competition(
                    data_source_competition_id=competition_options.get(competition_name,None),
                    competition_name=competition_name,
                    team_season_id=team_season_id
                )
                new_competitions.append(competition)
            fa_match_id = match_row.get_fa_match_id()
            if fa_match_id in matches_by_fa_match_id:
                match = matches_by_fa_match_id[fa_match_id]
                match.competition_id = competition.competition_id
                match.team_season_id = team_season_id
                match.competition_acronym = match_row.get_competition_acronym()
                match.goals_for=match_row.get_goals_for()
                match.goals_against=match_row.get_goals_against()
                match.goal_difference=match_row.get_goal_difference()
                match.pens_for=match_row.get_pens_for()
                match.pens_against=match_row.get_pens_against()
                match.opposition_team_name=match_row.get_oppo_team_name()
                match.result=match_row.get_result()
                match.date=match_row.get_date()
                match.time=match_row.get_time()
                match.location=None
                match.home_away_neutral=match_row.get_home_away_neutral()
                still_exists[fa_match_id] = True
                delete_match_errors.append(match.match_id)
            else:
                match = Match(
                    data_source_match_id=match_row.get_fa_match_id(),
                    competition_id=competition.competition_id,
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
                new_matches.append(match)
            match_errors = [
                MatchError(
                    match_id=match.match_id,
                    error_message=me
                )
                for me in match_row.match_errors
            ]
            new_match_errors.extend(match_errors)
            matches_to_return.append(match)
        match_ids_to_delete = [
            matches_by_fa_match_id[fa_match_id].match_id
            for fa_match_id, exists in still_exists.items()
            if exists == False
        ]

        return (
            new_matches,
            new_match_errors,
            new_competitions,
            delete_match_errors,
            match_ids_to_delete,
            matches_to_return
        )
    
    def get_competition_options(
        self,
        soup:BeautifulSoup
    ):
        competition_select = soup.find(
            'select',
            attrs={
                'name' : 'selectedFixtureGroupKey'
            }
        )
        competition_options = {}
        for comp_opt in competition_select.find_all('option'):
            key = comp_opt['value']
            val = comp_opt.text.strip()
            competition_options[key] = val
        return competition_options