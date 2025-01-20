import { TeamName } from "../types/TeamName.ts";
import { makeGetRequest, makePostRequest } from "./api.ts";

class TeamService {

    base_url = "/team"

    getTeamInformation(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get/${teamId}`
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

    getTeamOverviewStats(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-team-overview-stats/${teamId}`
        )
    }

    getTeamPlayerInformation(
        teamId:string
    ) {
        return makeGetRequest(
            this.base_url + `/get-player-information/${teamId}`
        )
    }
}

export default new TeamService();