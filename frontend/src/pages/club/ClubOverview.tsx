import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Club } from "../../types/Club";
import { getUserLS } from "../../authentication/auth";
import { getClub, getIsClubAdmin, getOverviewRowCount } from "../../helpers/other";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { GenericTableData } from "../../types/GenericTableTypes";
import { ClubOrTeamOverview } from "../../generic/club-or-team/ClubOrTeamOverview";

export const ClubOverview = () => {

    const [club, setClub] = useState<Club>();
    const [errorMessage, setErrorMessage] = useState("");
    const [matchTableDataArray, setMatchTableDataArray] = useState<GenericTableData[]>([]);
    const [playerTableDataArray, setPlayerTableDataArray] = useState<GenericTableData[]>([]);
    const [rowCount, setRowCount] = useState(1);

    let { clubId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            var _club_ = getClub(user, clubId);
            if (_club_) {
                setClub(_club_);
            } else {
                ClubService.getClubInformation(
                    clubId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setClub(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                    }
                )
            }
            ClubService.getClubOverviewStats(
                clubId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setMatchTableDataArray(res.data.matches);
                        setPlayerTableDataArray(res.data.players);
                        setRowCount(getOverviewRowCount(res.data.matches, res.data.players));
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
        },
        []
    )

    return (
        <ClubOrTeamOverview
            club={club}
            errorMessage={errorMessage}
            matchTableDataArray={matchTableDataArray}
            playerTableDataArray={playerTableDataArray}
            isClubAdmin={getIsClubAdmin(user,club?.club_id!)}
            rowCount={rowCount}
        />
    );
}