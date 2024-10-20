import { MarkerData } from "../types/MarkerData.ts";
import { makeGetRequest } from "./api.ts";
// import api from "./api.ts";

class OtherService {

    base_url = "/other"

    getAbrodobMarkers() {
        // return api.get(
        //     this.base_url + "/abrordob-markers"
        // )
        return makeGetRequest(
            this.base_url + "/abrordob-markers"
        )
    }
}

export default new OtherService();