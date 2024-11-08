import { BackendResponse } from "../types/BackendResponse.ts";
import { CLUB_TYPE, DATA_SOURCE } from "../types/enums.ts";
import { makeGetRequest, makePostRequest, transform } from "./api.ts";

class ClubService {

    base_url = "/club"

    // createNewClub(
    //     clubType:CLUB_TYPE,
    //     dataSource:DATA_SOURCE|null,
    //     clubId:string|null,
    //     clubName:string|null
    // ) {
    //     return makePostRequest(
    //         this.base_url + "/create",
    //         {
    //             clubType,
    //             dataSource,
    //             clubId,
    //             clubName
    //         }
    //     )
    // }

    async createNewClub(
        clubType:CLUB_TYPE,
        dataSource:DATA_SOURCE|null,
        clubId:string|null,
        clubName:string|null
    ) {
        const response = await makePostRequest(
            this.base_url + "/create",
            {
                clubType,
                dataSource,
                clubId,
                clubName
            }
        ).then(transform);
        // const response = await instance.post(
        //     this.base_url + "/create",
        //     {
        //         clubType,
        //         dataSource,
        //         clubId,
        //         clubName
        //     }
        // ).then(transform);
        return response as BackendResponse;
    }
}

export default new ClubService();