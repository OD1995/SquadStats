import { useParams } from "react-router-dom";
import { getUserLS } from "../../authentication/auth";
import { useEffect, useState } from "react";
import { Loading } from "../../generic/Loading";
import { getBigTitle, getIsClubAdmin } from "../../helpers/other";
import { ClubLinkBar } from "./generic/ClubLinkBar";
import { OverviewOption, OverviewSelector } from "../../generic/OverviewSelector";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { Player } from "../../types/Player";

export const ClubPlayersOverviewSelector = () => {
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [playerId, setPlayerId] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");
    const [playerOptions, setPlayerOptions] = useState<OverviewOption[]>([]);
    // const [club, setClub] = useState<Club>();
    const [clubName, setClubName] = useState<string>();
    const [link, setLink] = useState<string>("");

    let { clubId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            // var _club_ = getClub(user, clubId);
            // if (_club_) {
            //     setClub(_club_);
            //     setTeamOptions(getTeamOptions(_club_));
            // } else {
                // setIsLoading(true);
            ClubService.getClubPlayerInformation(
                clubId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setClubName(res.data.club_name);
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
            {getBigTitle(clubName)}
            <ClubLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
            />
            <div className="overview-selector-content">
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
        </div>
    );
}