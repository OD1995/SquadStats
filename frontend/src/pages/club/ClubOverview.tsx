import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Club } from "../../types/Club";
import ClubService from "../../services/ClubService";
import { BackendResponse } from "../../types/BackendResponse";
import { getClub, getIsClubAdmin } from "../../helpers/other";
import { getUserLS } from "../../authentication/auth";
import { ClubOrTeamOverview } from "../../generic/ClubOrTeamOverview";
import { PlayerOverviewTableData, TeamOverviewTableData } from "../../types/OverviewTableData";

export const ClubOverview = () => {

    const [club, setClub] = useState<Club>();
    const [errorMessage, setErrorMessage] = useState("");
    const [teamTableDataArray, setTeamTableDataArray] = useState<TeamOverviewTableData[]>([]);
    const [playerTableDataArray, setPlayerTableDataArray] = useState<PlayerOverviewTableData[]>([]);

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
                        setTeamTableDataArray(res.data.teams);
                        setPlayerTableDataArray(res.data.players);
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
            teamTableDataArray={teamTableDataArray}
            playerTableDataArray={playerTableDataArray}
            isClubAdmin={getIsClubAdmin(user,club?.club_id!)}
        />
    );
}