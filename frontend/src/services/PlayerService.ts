import { makeGetRequest, makePostRequest } from "./api.ts";

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

    getPlayerInfo(
        playerId:string
    ) {
        const url = this.base_url + `/get-player-info/${playerId}`
        return makeGetRequest(url)
    }

    updateBetterPlayerName(
        playerId:string,
        betterPlayerName:string
    ) {
        const url = this.base_url + "/update-better-player-name"
        return makePostRequest(
            url,
            {
                playerId,
                betterPlayerName
            }
        )
    }
}

export default new PlayerService();