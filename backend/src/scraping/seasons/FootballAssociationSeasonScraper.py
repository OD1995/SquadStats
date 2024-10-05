from src.scraping.seasons.SeasonScraper import SeasonScraper

class FootballAssociationSeasonScraper(SeasonScraper):

    def __init__(
        self,
        external_season_id:str,
        external_team_id:str
    ):
        self.external_season_id = external_season_id
        self.external_team_id = external_team_id

    def __build_results_url(self):
        results_url = "https://fulltime.thefa.com/results/1/100.html?"
        query_params = {
            "selectedSeason" : self.external_season_id,
            "selectedFixtureGroupAgeGroup" : 0,
            "selectedFixtureGroupKey" : "",
            "selectedDateCode" : "all",
            "selectedRelatedFixtureOption" : 2,
            "selectedTeam" : self.external_team_id
        }
        for k,v in query_params.items():
            results_url += f"&{k}={v}"
        return results_url

    def get_result_fixture_ids(self):
        results_soup = self.get_soup(self.__build_results_url())
        result_fixture_ids = []
        for div in results_soup.find_all(
            'div',
            {'class' : 'datetime-col'}
        ):
            if div.a is not None:
                result_fixture_ids.append(
                    self.get_fixture_id_from_div(div)
                )
        return result_fixture_ids

    def get_fixture_id_from_div(self, div):
        link = div.a['href']
        return link.split("=")[-1]