import { makeGetRequest, makePostRequest } from "./api"

class SeasonService {

    base_url = "/season"

    getTeamLeaguesAndSeasons(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-team-leagues-and-seasons/${teamId}`
        )
    }

    getClubSeasons(
        clubId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-club-seasons/${clubId}`
        )
    }

    updateSeasons(
        teamId:string
    ) {
        return makePostRequest(
            this.base_url + `/update-seasons`,
            {
                teamId
            }
        )
    }

    createNewLeagueAndSeason(
        leagueName:string,
        seasonName:string,
        teamId:string,
    ) {
        return makePostRequest(
            this.base_url + "/create-new-league-and-season",
            {
                leagueName,
                seasonName,
                teamId,
            }
        )
    }

    createNewSeason(
        teamId:string,
        seasonName:string
    ) {
        return makePostRequest(
            this.base_url + "/create-new-season",
            {
                teamId,
                seasonName
            }
        )
    }
}

export default new SeasonService();