import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { getIsClubAdmin, getTeam } from "../../helpers/other"
import { ClubOrTeamMatchesOrPlayers } from "../../generic/club-or-team/ClubOrTeamMatchesOrPlayers";
import { useEffect, useState } from "react";
import { Team } from "../../types/Team";
import TeamService from "../../services/TeamService";
import { BackendResponse } from "../../types/BackendResponse";
import { Loading } from "../../generic/Loading";

export const TeamMatches = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const user = getUserLS();
    const { teamId } = useParams();

    useEffect(
        () => {
            var _team_ = null;
            if (user) {
                _team_ = getTeam(user, teamId);
                if (_team_) {
                    setTeam(_team_);
                    setLoading(false);
                }
            }
            if (!_team_) {
                setLoading(true);
                TeamService.getTeamInformation(teamId!).then(
                    (res:BackendResponse) => {
                        if (res.data) {
                            setTeam(res.data)
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
                matches
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
            />
        )
    }
}