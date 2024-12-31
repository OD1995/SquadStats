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

    getMatchInfo(
        matchId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-match-info/${matchId}`
        )
    }

    getMatchesData(
        searchParams:string,
        clubId:string|null=null
    ) {
        var url = this.base_url + `/get-matches-data?${searchParams}`;
        if (clubId) {
            url += `&clubId=${clubId}`
        }
        return makeGetRequest(url)
    }
}

export default new MatchService();