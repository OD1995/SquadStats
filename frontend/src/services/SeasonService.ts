import { makeGetRequest, makePostRequest } from "./api"

class SeasonService {

    base_url = "/season"

    getTeamSeasons(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-seasons/${teamId}`
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