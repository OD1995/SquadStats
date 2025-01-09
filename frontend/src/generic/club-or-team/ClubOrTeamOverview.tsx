import "./ClubOrTeamOverview.css";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";
import { PlayerOverviewTableData, TeamOverviewTableData } from "../../types/OverviewTableData";
import { TeamOverviewTable } from "../../pages/team/overview/TeamOverviewTable";
import { PlayerOverviewTable } from "../../pages/team/overview/PlayerOverviewTable";
import { Loading } from "./../Loading";
import { ClubLinkBar } from "../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../pages/team/generic/TeamLinkBar";
import { isWiderThanHigher } from "../../helpers/windowDimensions";
import { generateId } from "../../helpers/other";

interface OwnProps {
    team?:Team
    club?:Club
    errorMessage:string
    teamTableDataArray:TeamOverviewTableData[]
    playerTableDataArray:PlayerOverviewTableData[]
    isClubAdmin:boolean
}

export const ClubOrTeamOverview = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();

    const generateParentTable = (
        teamTableDataArray:TeamOverviewTableData[],
        playerTableDataArray:PlayerOverviewTableData[]
    ) => {
        return (
            <table id='team-overview-parent-table'>
                <tr>
                    {generateTeamTableRow(teamTableDataArray)}
                </tr>
                <tr>
                    {generatePlayerTableRow(playerTableDataArray)}
                </tr>
            </table>
        )
    }

    const generateTeamTableRow = (teamTableDataArray:TeamOverviewTableData[]) => {
        return teamTableDataArray.map(
            (teamTableData:TeamOverviewTableData) => {
                return <td key={generateId()} className="team-overview-cell"><TeamOverviewTable {...teamTableData}/></td>
            }
        )
    }

    const generatePlayerTableRow = (playerTableDataArray:PlayerOverviewTableData[]) => {
        return playerTableDataArray.map(
            (playerTableData:PlayerOverviewTableData) => {
                return <td key={generateId()} className="team-overview-cell"><PlayerOverviewTable {...playerTableData}/></td>
            }
        )
    }

    const generateTableColumn = (
        teamTableDataArray:TeamOverviewTableData[],
        playerTableDataArray:PlayerOverviewTableData[]
    ) => {
        var returnArray = [] as JSX.Element[];
        teamTableDataArray.map(
            (data:TeamOverviewTableData) => {
                returnArray.push(<TeamOverviewTable key={generateId()} {...data}/>)
            }
        )
        playerTableDataArray.map(
            (data:PlayerOverviewTableData) => {
                returnArray.push(<PlayerOverviewTable key={generateId()} {...data}/>)
            }
        )
        return returnArray;
    }

    // if (
    //     (props.errorMessage == "") && (
    //         (props.teamTableDataArray.length == 0) || (
    //             (props.team == null) && (props.club == null)
    //         )
    //     )
    // ) {
    //     return (
    //         <div id='team-overview-parent'>
    //             <Loading/>
    //         </div>
    //     )
    // } else {
    return (
        <div id='cot-overview-parent'>
            <h1 className="big-h1-title">
                {props.team?.team_name ?? props.club?.club_name}
            </h1>
            <div id='cot-overview-content'>
                {
                    props.club ? (
                        <ClubLinkBar
                            isClubAdmin={props.isClubAdmin}
                        />
                    ) : (
                        <TeamLinkBar
                            isClubAdmin={props.isClubAdmin}
                            clubId={props.team?.club_id!}
                        />
                    )
                }
                {
                    ((props.errorMessage == "") && (
                        (props.teamTableDataArray.length == 0) || (
                            (props.team == null) && (props.club == null)
                        )
                    )) && <Loading/>
                }
                <div>
                    {props.errorMessage}
                </div>
                {
                    isDesktop ? (
                        <div id='cot-overview-tables-desktop'>
                            {generateParentTable(props.teamTableDataArray, props.playerTableDataArray)}
                        </div>
                    ) : (
                        <div id='cot-overview-tables-mobile'>
                            {generateTableColumn(props.teamTableDataArray, props.playerTableDataArray)}
                        </div>
                    )
                }
            </div>
        </div>
    );
}