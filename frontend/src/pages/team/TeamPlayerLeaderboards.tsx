import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { ClubOrTeamMatchesOrPlayers } from "../../generic/club-or-team/ClubOrTeamMatchesOrPlayers";
import { useEffect, useState } from "react";
import { Team } from "../../types/Team";
import { getIsClubAdmin, getTeam } from "../../helpers/other";
import TeamService from "../../services/TeamService";
import { BackendResponse } from "../../types/BackendResponse";

export const TeamPlayerLeaderboards = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    // const [teamLoaded, setTeamLoaded] = useState<boolean>(false);

    const user = getUserLS();
    const { teamId } = useParams();

    useEffect(
        () => {
            var loadTeam = true;
            var tm = null;
            if (user) {
                tm = getTeam(user, teamId!);
                if (tm) {
                    loadTeam = false;
                    setTeam(tm);
                }
            }
            if (loadTeam) {
                // setLoading(true);
                TeamService.getTeamInformation(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setTeam(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                        // setLoading(false);
                    }
                )
            }
        },
        []
    )

    if (team) {
        return (
            <ClubOrTeamMatchesOrPlayers
                team={team}
                isClubAdmin={getIsClubAdmin(user, team?.club_id!)}
                players
                errorMsg={errorMessage}
                // isLoadng={loading}
            />
        )
    }
}