import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { getIsClubAdmin, getTeam } from "../../helpers/other"
import { ClubOrTeamMatchesOrPlayers } from "../../generic/club-or-team/ClubOrTeamMatchesOrPlayers";
import { Team } from "../../types/Team";
import { useEffect, useState } from "react";
import TeamService from "../../services/TeamService";
import { BackendResponse } from "../../types/BackendResponse";
import { Loading } from "../../generic/Loading";

export const TeamPlayers = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

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
                    setLoading(false);
                }
            }
            if (loadTeam) {
                setLoading(true);
                TeamService.getTeamInformation(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setTeam(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                        setLoading(false);
                    }
                )
            }
        },
        []
    )

    if (loading) {
        return <Loading/>
    } else {
        return (
            <ClubOrTeamMatchesOrPlayers
                team={team}
                isClubAdmin={getIsClubAdmin(user, team?.club_id!)}
                players
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        )
    }
}