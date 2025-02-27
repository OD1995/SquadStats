import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserLS } from "../../../../authentication/auth";
import { Team } from "../../../../types/Team";
import { getBigTitle, getIsClubAdmin, getTeam } from "../../../../helpers/other";
import { TeamLinkBar } from "../../generic/TeamLinkBar";
import { PlayerSelection } from "./PlayerSelection";

export const UpdateMatch = () => {

    const [team, setTeam] = useState<Team>();

    const user = getUserLS();
    let { teamId, teamSeasonId, matchId } = useParams();
    const navigate = useNavigate();

    useEffect(
        () => {
            if (!user) {
                navigate("/about");
            } else {
                const _team_ = getTeam(user, teamId);
                setTeam(_team_!);
                console.log(teamId);
                console.log(teamSeasonId);
                console.log(matchId);
            }
        },
        []
    )

    return (
        <div className='page-parent'>
            {getBigTitle(team?.team_name)}
            <TeamLinkBar
                team={team!}
                isClubAdmin={getIsClubAdmin(user, team?.club_id!)}
                clubId={team?.club_id!}
            />
            <PlayerSelection

            />
        </div>
    );
}