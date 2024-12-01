import { TeamName } from "../types/TeamName.ts";
import { makeGetRequest, makePostRequest } from "./api.ts";

class TeamService {

    base_url = "/team"

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

    getTeamInformation(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get/${teamId}`
        )
    }

    getTeamSeasons(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-seasons/${teamId}`
        )
    }

    getTeamNames(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-team-names/${teamId}`
        )
    }

    saveTeamNames(
        teamNames:TeamName[]
    ) {
        return makePostRequest(
            this.base_url + "/save-team-names",
            teamNames
        )
    }
}

export default new TeamService();