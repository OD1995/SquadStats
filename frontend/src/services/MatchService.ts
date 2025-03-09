import { Match } from "../types/Match.ts";
import { Player } from "../types/Player.ts";
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
        clubId:string|null=null,
        teamId:string|null=null
    ) {
        var url = this.base_url + `/get-matches-data?${searchParams}`;
        if (clubId) {
            url += `&clubId=${clubId}`;
        }
        if (teamId) {
            url += `&teamId=${teamId}`;
        }
        return makeGetRequest(url);
    }

    createMatch(
        match:Match,
        activePlayers:Record<string, Player>,
        goals:Record<string,number>,
        potm:string,
        newCompName:string, 
        newCompAcronym:string,
        teamId:string,
        leagueSeasonId:string
    ) {
        return makePostRequest(
            this.base_url + "/create",
            {
                match,
                activePlayers,
                goals,
                potm,
                newCompName,
                newCompAcronym,
                teamId,
                leagueSeasonId
            }
        )
    }
}

export default new MatchService();