import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { ClubOrTeamMatches } from "../../generic/club-or-team/matches/ClubOrTeamMatches"
import { getIsClubAdmin, getTeam } from "../../helpers/other"

export const TeamMatches = () => {

    const user = getUserLS();
    const { teamId } = useParams();
    const team = getTeam(user, teamId)!;

    return (
        <ClubOrTeamMatches
            team={team}
            isClubAdmin={getIsClubAdmin(user, team.club_id)}
        />
    )
}