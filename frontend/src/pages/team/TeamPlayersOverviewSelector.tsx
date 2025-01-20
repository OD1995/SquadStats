import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { Loading } from "../../generic/Loading";
import { getBigTitle, getClub, getClubId, getIsClubAdmin } from "../../helpers/other";
import { OverviewOption, OverviewSelector } from "../../generic/OverviewSelector";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";
import { Player } from "../../types/Player";
import { TeamLinkBar } from "./generic/TeamLinkBar";
import TeamService from "../../services/TeamService";

export const TeamPlayersOverviewSelector = () => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [playerId, setPlayerId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [playerOptions, setPlayerOptions] = useState<OverviewOption[]>([]);
    const [clubId, setClubId] = useState<string>();
    const [teamName, setTeamName] = useState<string>();
    const [link, setLink] = useState<string>("");

    let { teamId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            TeamService.getTeamPlayerInformation(
                teamId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setClubId(res.data.club_id);
                        setTeamName(res.data.team_name);
                        setPlayerOptions(getOptions(res.data.players));
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
            setLink(`/player/${playerId}/overview`)
        },
        [playerId]
    )

    const getOptions = (players:Player[]) => {
        return players.map(
            (player:Player) => (
                {
                    label: player.player_name,
                    value: player.player_id
                }
            )
        )
    }

    if (isLoading) {
        return <Loading/>
    }
    
    return (
        <div className="page-parent">
            {getBigTitle(teamName)}
            <TeamLinkBar
                clubId={clubId!}
                isClubAdmin={getIsClubAdmin(user, clubId!)}
            />
            <div className="error-message">
                {errorMessage}
            </div>
            <OverviewSelector
                label="Player"
                overviewId={playerId}
                setOverviewId={setPlayerId}
                overviewOptions={playerOptions}
                link={link}
            />
        </div>
    );
}