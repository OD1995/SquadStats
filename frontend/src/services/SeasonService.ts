import { makeGetRequest, makePostRequest } from "./api"

class SeasonService {

    base_url = "/season"

    getTeamSeasons(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-team-seasons/${teamId}`
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
}

export default new SeasonService();