import { makeGetRequest } from "./api.ts";

class OtherService {

    base_url = "/other"

    getAbrodobMarkers() {
        return makeGetRequest(
            this.base_url + "/abrordob-markers"
        )
    }
}

export default new OtherService();