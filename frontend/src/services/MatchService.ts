import { makeGetRequest, makePostRequest } from "./api.ts";

class MatchService {

    base_url = "/match"

    getCurrentMatches(
        teamId:string,
        leagueSeasonId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-current-matches/${teamId}/${leagueSeasonId}`
        )
    }

    updateTeamMatches(
        teamId:string,
        leagueSeasonId:string
    ) {
        return makePostRequest(
            this.base_url + `/update-matches`,
            {
                teamId,
                leagueSeasonId
            }
        )
    }

    scrapeMatches(
        matchIds:string[]
    ) {
        return makePostRequest(
            this.base_url + "/scrape-matches",
            {
                matchIds
            }
        )
    }
}

export default new MatchService();