import "./ClubOrTeamOverview.css";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";
import { Loading } from "../Loading";
import { ClubLinkBar } from "../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../pages/team/generic/TeamLinkBar";
import { isWiderThanHigher } from "../../helpers/windowDimensions";
import { generateId, getBigTitle } from "../../helpers/other";
import { BetterTable } from "../BetterTable";
import { GenericTableData } from "../../types/GenericTableTypes";

interface OwnProps {
    team?:Team
    club?:Club
    errorMessage:string
    teamTableDataArray:GenericTableData[]
    playerTableDataArray:GenericTableData[]
    isClubAdmin:boolean
}

export const ClubOrTeamOverview = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();

    const generateParentTable = () => {
        return (
            <table id='team-overview-parent-table'>
                <thead>
                    <tr>
                        {generateTeamTableRow()}
                    </tr>
                    <tr>
                        {generatePlayerTableRow()}
                    </tr>
                </thead>
            </table>
        )
    }

    const generateTable = (data:GenericTableData) => {
        return (
            <BetterTable
                key={generateId()}
                rowsPerPage={5}
                titleClassName="overview-table-title small-caps-subtitle"
                {...data}
            />
        )
    }

    const generateTeamTableRow = () => {
        return props.teamTableDataArray.map(
            (teamTableData:GenericTableData) => {
                return (
                    <td key={generateId()} className="team-overview-cell">
                        {generateTable(teamTableData)}
                    </td>
                )
            }
        )
    }

    const generatePlayerTableRow = () => {
        return props.playerTableDataArray.map(
            (playerTableData:GenericTableData) => {
                return (
                    <td key={generateId()} className="team-overview-cell">
                        {generateTable(playerTableData)}
                    </td>
                )
            }
        )
    }

    const generateTableColumn = () => {
        return props.teamTableDataArray.concat(props.playerTableDataArray).map(
            (data:GenericTableData) => generateTable(data)
        );
    }

    return (
        <div className='page-parent'>
            {getBigTitle(props.team?.team_name ?? props.club?.club_name)}
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
                <div className="error-message">
                    {props.errorMessage}
                </div>
                {
                    isDesktop ? (
                        <div id='cot-overview-tables-desktop'>
                            {generateParentTable()}
                        </div>
                    ) : (
                        <div id='cot-overview-tables-mobile'>
                            {generateTableColumn()}
                        </div>
                    )
                }
            </div>
        </div>
    );
}