import { BackendResponse } from "../types/BackendResponse.ts";
import { instance, makeGetRequest, makePostRequest, transform } from "./api.ts";

class OtherService {

    base_url = "/other"

    getAbrodobMarkers() {
        return makeGetRequest(
            this.base_url + "/abrordob-markers"
        )
    }

    async test() {
        // const response = await makeGetRequest(
        //     this.base_url + "/test"
        // ).then(transform);
        // return response as BackendResponse;
        return instance.get(this.base_url + "/test");
    }
}

export default new OtherService();