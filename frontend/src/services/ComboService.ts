import { makeGetRequest } from "./api.ts";

class ComboService {

    base_url = "/combo"

    getMatchesOrPlayersFilterData(
        params:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-matches-or-players-filter-data?${params}`
        )
    }
}

export default new ComboService();