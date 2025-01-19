import { ChangeEvent, useEffect, useState } from "react";
import { getBigTitle, getIsClubAdmin } from "../../helpers/other"
import { getUserLS } from "../../authentication/auth";
import { useParams } from "react-router-dom";
import PlayerService from "../../services/PlayerService";
import { BackendResponse } from "../../types/BackendResponse";
import { Player } from "../../types/Player";
import { PlayerLinkBar } from "./PlayerLinkBar";
import "./EditPlayerName.css";
import { Loading } from "../../generic/Loading";

export const EditPlayerName = () => {

    const [bestPlayerName, setBestPlayerName] = useState<string>();
    const [dataSourcePlayerName, setDataSourcePlayerName] = useState<string>();
    const [betterPlayerName, setBetterPlayerName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [responseMessage, setResponseMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [clubId, setClubId] = useState<string>();

    const user = getUserLS();
    let { playerId } = useParams();

    const updateStates = (data:Player) => {
        setBestPlayerName(data.player_name);
        setDataSourcePlayerName(data.data_source_player_name);
        setBetterPlayerName(data.better_player_name ?? "");
        setClubId(data.club_id);
    }

    useEffect(
        () => {
            setIsLoading(true);
            PlayerService.getPlayerInfo(
                playerId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        const data = res.data as Player;
                        updateStates(data);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                    setIsLoading(false);
                }
            )
        },
        []
    )

    const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
        setBetterPlayerName(event.target.value);
    }

    const handleSaveClick = () => {
        PlayerService.updateBetterPlayerName(
            playerId!,
            betterPlayerName
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    const data = res.data as Player;
                    updateStates(data);
                    setResponseMessage("Success!");
                } else {
                    setErrorMessage(res.data.message);
                }
                setIsLoading(false);
            }     
        )
    }

    if (isLoading) {
        return <Loading/>
    }
    return (
        <div className="page-parent">
            {getBigTitle(bestPlayerName)}
            <PlayerLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
                playerId={playerId!}
                clubId={clubId!}
            />
            <div className="error-message">
                {errorMessage}
            </div>
            <div id='player-name-entry'>
                <div className="player-name-entry-row">
                    <b className="player-name-entry-label">
                        Data Source Name
                    </b>
                    <input
                        value={dataSourcePlayerName}
                        disabled={true}
                    />
                </div>                
                <div className="player-name-entry-row">
                    <b className="player-name-entry-label">
                        Better Name
                    </b>
                    <input
                        value={betterPlayerName}
                        onChange={handleInputChange}
                    />
                </div>
                <div id='player-name-button-row' className="player-name-entry-row">
                    <button
                        id='player-name-button'
                        className="ss-green-button"
                        onClick={handleSaveClick}
                    >
                        Save
                    </button>
                </div>
                <div className="success-message">
                    {responseMessage}
                </div>
            </div>
        </div>
    )
}