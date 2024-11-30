import { makePostRequest } from "./api.ts";

class MatchService {

    base_url = "/match"

    saveTeamNames(
        matchIds:string[]
    ) {
        return makePostRequest(
            this.base_url + "/scrape-matches",
            matchIds
        )
    }
}

export default new MatchService();