import { useEffect, useState } from "react";
import { Team } from "../../../types/Team";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/slices/userSlice";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { getTeam } from "../../../helpers/other";
import { OverviewTableData } from "../../../types/OverviewTableData";
import { OverviewTable } from "./OverviewTable";
import "./TeamOverview.css";
import { TeamLinkBar } from "../generic/TeamLinkBar";

export const TeamOverview = () => {

    const [team, setTeam] = useState<Team>();
    const [errorMessage, setErrorMessage] = useState("");
    const [teamTableDataArray, setTeamTableDataArray] = useState<OverviewTableData[]>([]);
    const [playerTableDataArray, setPlayerTableDataArray] = useState<OverviewTableData[]>([]);

    let { teamId } = useParams();
    const user = useSelector(userSelector);

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

    const generateTableRow = (tableDataArray:OverviewTableData[]) => {
        return [
            <OverviewTable {...tableDataArray[0]}/>,
            <hr className="vertical-line"/>,
            <OverviewTable {...tableDataArray[1]}/>,
        ]
    }

    // const generateTables = (
    //     teamData:OverviewTableData[],
    //     playerData:OverviewTableData[]
    // ) => {
    //     var arrayToReturn = [];
    //     for (const td of teamData) {
    //         arrayToReturn.push(
    //             <OverviewTable {...td}/>
    //         )
    //     }
    //     for (const pd of playerData) {
    //         arrayToReturn.push(
    //             <OverviewTable {...pd}/>
    //         )
    //     }
    //     return arrayToReturn;
    // }

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
            (teamTableData:OverviewTableData) => {
                return <td className="team-overview-cell"><OverviewTable {...teamTableData}/></td>
            }
        )
    }

    const generatePlayerTableRow = () => {
        return playerTableDataArray.map(
            (playerTableData:OverviewTableData) => {
                return <td className="team-overview-cell"><OverviewTable {...playerTableData}/></td>
            }
        )
    }

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
                <div id='team-overview-tables-div'>
                    {generateParentTable()}
                </div>
            </div>
        </div>
    );
}