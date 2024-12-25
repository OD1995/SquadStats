import { CLUB_TYPE, DATA_SOURCE } from "../types/enums.ts";
import { makeGetRequest, makePostRequest } from "./api.ts";

class ClubService {

    base_url = "/club"

    createNewClub(
        clubType:CLUB_TYPE,
        dataSource:DATA_SOURCE|null,
        clubId:string|null,
        clubName:string|null
    ) {
        return makePostRequest(
            this.base_url + "/create",
            {
                clubType,
                dataSource,
                clubId,
                clubName
            }
        )
    }

    getClubInformation(
        clubId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get/${clubId}`
        )
    }

    getClubOverviewStats(
        clubId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-club-overview-stats/${clubId}`
        )
    }
}

export default new ClubService();