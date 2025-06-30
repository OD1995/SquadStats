import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GenericTableData } from "../../types/GenericTableTypes";
import PlayerService from "../../services/PlayerService";
import { BackendResponse } from "../../types/BackendResponse";
import { Loading } from "../../generic/Loading";
import { generateId, getBigTitle, getIsClubAdmin } from "../../helpers/other";
import { PlayerLinkBar } from "./PlayerLinkBar";
import { getUserLS } from "../../authentication/auth";
import { BetterTable } from "../../generic/BetterTable";
import "./PlayerApps.css";

export const PlayerApps = () => {

    const [tableData, setTableData] = useState<GenericTableData>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [playerName, setPlayerName] = useState<string>();
    const [clubId, setClubId] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const user = getUserLS();
    let { playerId } = useParams();

    useEffect(
        () => {
            PlayerService.getPlayerAppsData(
                playerId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setTableData(res.data.table_data);
                        setPlayerName(res.data.player_name);
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
                {
                    (tableData) && (
                        <BetterTable
                            key={generateId()}
                            {...tableData!}
                            rowsPerPage={15}
                            titleClassName="small-caps-subtitle  sortable-table-title"
                            tableClassName="player-apps-table-div"
                        />
                    )
                }
            </div>
        );
}