import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth"
import { getClub, getIsClubAdmin } from "../../helpers/other"
import { ClubOrTeamMatchesOrPlayers } from "../../generic/club-or-team/ClubOrTeamMatchesOrPlayers";

export const ClubPlayerLeaderboards = () => {

    const user = getUserLS();
    const { clubId } = useParams();

    return (
        <ClubOrTeamMatchesOrPlayers
            club={getClub(user, clubId)!}
            isClubAdmin={getIsClubAdmin(user, clubId!)}
            players
        />
    )
}