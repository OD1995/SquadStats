import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { Loading } from "../../generic/Loading";
import { getBigTitle, getClub, getIsClubAdmin } from "../../helpers/other";
import { OverviewOption, OverviewSelector } from "../../generic/OverviewSelector";
import { BackendResponse } from "../../types/BackendResponse";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";
import { PlayerLinkBar } from "./PlayerLinkBar";
import PlayerService from "../../services/PlayerService";

export const PlayerTeamsOverviewSelector = () => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [teamId, setTeamId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [teamOptions, setTeamOptions] = useState<OverviewOption[]>([]);
    const [playerName, setPlayerName] = useState<string>();
    // const [playerId, setPlayerId] = useState<string>();
    const [clubId, setClubId] = useState<string>();
    const [link, setLink] = useState<string>("");

    let { playerId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            // setIsLoading(true);
            PlayerService.getPlayerTeams(
                playerId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setPlayerName(res.data.player_name);
                        // setPlayerId(res.data.player_id);
                        setTeamOptions(getOptions(res.data.teams));
                        setClubId(res.data.club_id);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                    setIsLoading(false);
                }
            )
        },
        []
    )

    useEffect(
        () => {
            setLink(`/team/${teamId}/overview`)
        },
        [teamId]
    )

    const getOptions = (teams:Team[]) => {
        return teams.map(
            (team:Team) => (
                {
                    label: team.team_name,
                    value: team.team_id
                }
            )
        )
    }

    if (isLoading) {
        return <Loading/>
    }
    
    return (
        <div className="page-parent">
            {getBigTitle(playerName)}
            <PlayerLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
                playerId={playerId!}
                clubId={clubId!}
            />
            <div className="error-message">
                {errorMessage}
            </div>
            <OverviewSelector
                label="Team"
                overviewId={teamId}
                setOverviewId={setTeamId}
                overviewOptions={teamOptions}
                link={link}
            />
        </div>
    );
}