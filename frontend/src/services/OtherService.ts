import { makeGetRequest } from "./api.ts";

class OtherService {

    base_url = "/other"

    getAbrodobMarkers() {
        return makeGetRequest(
            this.base_url + "/abrordob-markers"
        )
    }

    getRandom() {
        return makeGetRequest(
            this.base_url + "/random"
        )
    }

    getChangeLog() {
        return makeGetRequest(
            this.base_url + "/get-change-log"
        )
    }
}

export default new OtherService();