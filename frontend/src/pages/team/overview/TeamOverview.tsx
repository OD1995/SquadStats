import { useEffect, useState } from "react";
import { Team } from "../../../types/Team";
import { useParams } from "react-router-dom";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { getIsClubAdmin, getTeam } from "../../../helpers/other";
import { PlayerOverviewTableData, TeamOverviewTableData } from "../../../types/OverviewTableData";
import "./TeamOverview.css";
import { ClubOrTeamOverview } from "../../../generic/ClubOrTeamOverview";
import { getUserLS } from "../../../authentication/auth";

export const TeamOverview = () => {

    const [team, setTeam] = useState<Team|null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [teamTableDataArray, setTeamTableDataArray] = useState<TeamOverviewTableData[]>([]);
    const [playerTableDataArray, setPlayerTableDataArray] = useState<PlayerOverviewTableData[]>([]);
    const [isClubAdmin, setIsClubAdmin] = useState<boolean>(false);

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
                        setTeamTableDataArray(res.data.teams);
                        setPlayerTableDataArray(res.data.players);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
            setIsClubAdmin(getIsClubAdmin(user,team?.club_id!));
        },
        []
    )

    return (
        <ClubOrTeamOverview
            team={team!}
            errorMessage={errorMessage}
            teamTableDataArray={teamTableDataArray}
            playerTableDataArray={playerTableDataArray}
            isClubAdmin={isClubAdmin}
        />
    )
}