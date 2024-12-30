import { useParams } from "react-router-dom";
import { getUserLS } from "../../../authentication/auth"
import { ClubOrTeamMatches } from "../../../generic/club-or-team/matches/ClubOrTeamMatches"
import { getClub } from "../../../helpers/other"
import { useState } from "react";

export const ClubMatches = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const user = getUserLS();
    const { clubId } = useParams();

    return (
        <ClubOrTeamMatches
            club={getClub(user, clubId)!}
            isClubAdmin={true}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
        />
    )
}