import { useEffect, useState } from "react";
import { Team } from "../../../types/Team";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/slices/userSlice";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { getTeam } from "../../../helpers/other";
import { PlayerOverviewTableData, TeamOverviewTableData } from "../../../types/OverviewTableData";
import "./TeamOverview.css";
import { TeamLinkBar } from "../generic/TeamLinkBar";
import { Loading } from "../../../generic/Loading";
import { TeamOverviewTable } from "./TeamOverviewTable";
import { PlayerOverviewTable } from "./PlayerOverviewTable";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";

export const TeamOverview = () => {

    const [team, setTeam] = useState<Team|null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [teamTableDataArray, setTeamTableDataArray] = useState<TeamOverviewTableData[]>([]);
    const [playerTableDataArray, setPlayerTableDataArray] = useState<PlayerOverviewTableData[]>([]);

    let { teamId } = useParams();
    const user = useSelector(userSelector);
    const isDesktop = isWiderThanHigher();

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
        },
        []
    )

    const generateParentTable = () => {
        return (
            <table id='team-overview-parent-table'>
                <tr>
                    {generateTeamTableRow()}
                </tr>
                <tr>
                    {generatePlayerTableRow()}
                </tr>
            </table>
        )
    }

    const generateTeamTableRow = () => {
        return teamTableDataArray.map(
            (teamTableData:TeamOverviewTableData) => {
                return <td className="team-overview-cell"><TeamOverviewTable {...teamTableData}/></td>
            }
        )
    }

    const generatePlayerTableRow = () => {
        return playerTableDataArray.map(
            (playerTableData:PlayerOverviewTableData) => {
                return <td className="team-overview-cell"><PlayerOverviewTable {...playerTableData}/></td>
            }
        )
    }

    const generateTableColumn = () => {
        var returnArray = [] as JSX.Element[];
        teamTableDataArray.map(
            (data:TeamOverviewTableData) => {
                returnArray.push(<TeamOverviewTable {...data}/>)
            }
        )
        playerTableDataArray.map(
            (data:PlayerOverviewTableData) => {
                returnArray.push(<PlayerOverviewTable {...data}/>)
            }
        )
        return returnArray;
    }

    if (
        (errorMessage == "") && (
            (team == null) || (teamTableDataArray.length == 0)
        )
    ) {
        return (
            <div id='team-overview-parent'>
                <Loading/>
            </div>
        )
    } else {
        return (
            <div id='team-overview-parent'>
                <h1 className="big-h1-title">
                    {team?.team_name}
                </h1>
                <div id='team-overview-content'>
                    <TeamLinkBar/>
                    <div>
                        {errorMessage}
                    </div>
                    {
                        isDesktop ? (
                            <div id='team-overview-tables-desktop'>
                                {generateParentTable()}
                            </div>
                        ) : (
                            <div id='team-overview-tables-mobile'>
                                {generateTableColumn()}
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}