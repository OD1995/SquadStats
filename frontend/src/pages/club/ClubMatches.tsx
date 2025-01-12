import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { ClubOrTeamMatches } from "../../generic/club-or-team/matches/ClubOrTeamMatches"
import { getClub, getIsClubAdmin } from "../../helpers/other"

export const ClubMatches = () => {

    const user = getUserLS();
    const { clubId } = useParams();

    return (
        <ClubOrTeamMatches
            club={getClub(user, clubId)!}
            isClubAdmin={getIsClubAdmin(user, clubId!)}
        />
    )
}