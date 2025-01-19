import { makeGetRequest } from "./api.ts";

class ComboService {

    base_url = "/combo"

    getMatchesOrPlayersFilterData(
        params:string,
        isPlayers:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-matches-or-players-filter-data?${params}&isPlayers=${isPlayers}`
        )
    }
}

export default new ComboService();