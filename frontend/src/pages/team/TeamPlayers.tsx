import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { getIsClubAdmin, getTeam } from "../../helpers/other"
import { ClubOrTeamMatchesOrPlayers } from "../../generic/club-or-team/ClubOrTeamMatchesOrPlayers";

export const TeamPlayers = () => {

    const user = getUserLS();
    const { teamId } = useParams();
    const team = getTeam(user, teamId)!;

    return (
        <ClubOrTeamMatchesOrPlayers
            team={team}
            isClubAdmin={getIsClubAdmin(user, team.club_id)}
            players
        />
    )
}