import { makeGetRequest } from "./api.ts";

class PlayerService {

    base_url = "/player"

    getLeaderboardData(
        searchParams:string,
        clubId:string|null=null,
        teamId:string|null=null
    ) {
        var url = this.base_url + `/get-leaderboard-data?${searchParams}`;
        if (clubId) {
            url += `&clubId=${clubId}`;
        }
        if (teamId) {
            url += `&teamId=${teamId}`;
        }
        return makeGetRequest(url);
    }
}

export default new PlayerService();