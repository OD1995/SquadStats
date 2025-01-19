import { useEffect, useState } from "react";
import { getUserLS } from "../../authentication/auth";
import { generateId, getBigTitle, getIsClubAdmin } from "../../helpers/other";
import PlayerService from "../../services/PlayerService";
import { useParams } from "react-router-dom";
import { BackendResponse } from "../../types/BackendResponse";
import { Player } from "../../types/Player";
import { PlayerLinkBar } from "./PlayerLinkBar";
import { GenericTableData } from "../../types/GenericTableTypes";
import { Loading } from "../../generic/Loading";
import { BetterTable } from "../../generic/BetterTable";
import "./PlayerView.css";

export const PlayerView = () => {

    const [playerName, setPlayerName] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [clubId, setClubId] = useState<string>();
    const [tableDataArray, setTableDataArray] = useState<GenericTableData[]>([]);
    const [appearances, setAppearances] = useState<number>();
    const [goals, setGoals] = useState<number>();

    const user = getUserLS();
    let { playerId } = useParams();

    useEffect(
        () => {
            // setIsLoading(true);
            PlayerService.getPlayerInfo(
                playerId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        const data = res.data.player as Player;
                        setPlayerName(data.player_name);
                        setClubId(data.club_id);
                        setTableDataArray(res.data.tables);
                        setAppearances(res.data.player_stats.appearances);
                        setGoals(res.data.player_stats.goals);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                    setIsLoading(false);
                }
            )
        },
        []
    )

    if (isLoading) {
        return <Loading/>
    }
    return (
        <div className='page-parent'>
            {getBigTitle(playerName)}
            <PlayerLinkBar
                isClubAdmin={getIsClubAdmin(user, clubId!)}
                playerId={playerId!}
                clubId={clubId!}
            />
            <div className="error-message">
                {errorMessage}
            </div>
            <div id='basic-player-stats-div'>
                <div className="basic-player-stat">
                    <h5>Appearances</h5>
                    <h3>{appearances}</h3>
                </div>
                <div className="basic-player-stat">
                    <h5>Goals</h5>
                    <h3>{goals}</h3>
                </div>
            </div>
            {
                tableDataArray.map(
                    (data:GenericTableData) => (
                        <BetterTable
                            key={generateId()}
                            {...data}
                            rowsPerPage={2}
                            titleClassName="small-caps-subtitle  sortable-table-title"
                        />
                    )
                )
            }
        </div>
    );
}