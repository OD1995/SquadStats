import { makeGetRequest } from "./api.ts";

class ComboService {

    base_url = "/combo"

    getMatchesFilterData(
        params:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-matches-filter-data?${params}`
        )
    }
}

export default new ComboService();