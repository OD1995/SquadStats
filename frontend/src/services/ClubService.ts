import { CLUB_TYPE } from "../types/enums.ts";
import { makeGetRequest, makePostRequest } from "./api.ts";

class ClubService {

    base_url = "/club"

    createNewClub(
        clubType:CLUB_TYPE,
        clubId:string|null
    ) {
        return makePostRequest(
            this.base_url + "/create",
            {
                clubType,
                clubId
            }
        )
    }
}

export default new ClubService();