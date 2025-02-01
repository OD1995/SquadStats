import { useEffect, useState } from "react";
import { Team } from "../../../types/Team";
import { useParams } from "react-router-dom";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { getIsClubAdmin, getOverviewRowCount, getTeam } from "../../../helpers/other";
import "./TeamOverview.css";
import { getUserLS } from "../../../authentication/auth";
import { GenericTableData } from "../../../types/GenericTableTypes";
import { ClubOrTeamOverview } from "../../../generic/club-or-team/ClubOrTeamOverview";

export const TeamOverview = () => {

    const [team, setTeam] = useState<Team|null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [matchTableDataArray, setMatchTableDataArray] = useState<GenericTableData[]>([]);
    const [playerTableDataArray, setPlayerTableDataArray] = useState<GenericTableData[]>([]);
    const [isClubAdmin, setIsClubAdmin] = useState<boolean>(false);
    const [rowCount, setRowCount] = useState(1);

    let { teamId } = useParams();
    const user = getUserLS();

    useEffect(
        () => {
            var _team_ = getTeam(user, teamId);
            if (_team_) {
                setTeam(_team_);
            } else {
                TeamService.getTeamInformation(
                    teamId!
                ).then(
                    (res:BackendResponse) => {
                        if (res.success) {
                            setTeam(res.data);
                        } else {
                            setErrorMessage(res.data.message);
                        }
                    }
                )
            }
            TeamService.getTeamOverviewStats(
                teamId!
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

    useEffect(
        () => {
            setIsClubAdmin(getIsClubAdmin(user,team?.club_id!));
        },
        [team]
    )

    return (
        <ClubOrTeamOverview
            team={team!}
            errorMessage={errorMessage}
            matchTableDataArray={matchTableDataArray}
            playerTableDataArray={playerTableDataArray}
            isClubAdmin={isClubAdmin}
            rowCount={rowCount}
        />
    )
}