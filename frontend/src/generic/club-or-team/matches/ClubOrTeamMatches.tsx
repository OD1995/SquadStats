import { ClubLinkBar } from "../../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../../pages/team/generic/TeamLinkBar";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import "./ClubOrTeamMatches.css";
import { MatchesFilter } from "./MatchesFilter";
import { GenericTableData } from "../../../types/GenericTableData";
import { useState } from "react";
import { Table } from "../../Table";
import { TableWithTitle } from "../../TableWithTitle";

interface OwnProps {
    club?:Club
    team?:Team
    isClubAdmin:boolean
    errorMessage:string
    setErrorMessage:Function
}

export const ClubOrTeamMatches = (props:OwnProps) => {

    const [tableData, setTableData] = useState<GenericTableData[]>([]);

    return (
        <div id='cot-matches-parent' className="parent-div">
            <h1 className="big-h1-title">
                {props.team?.team_name ?? props.club?.club_name}
            </h1>
            <div id='cot-matches-content'>
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
                <MatchesFilter
                    club={props.club}
                    team={props.team}
                    setErrorMessage={props.setErrorMessage}
                    setTableData={setTableData}
                />
                <div>
                    {props.errorMessage}
                </div>
                <div id='cotm-table-content'>
                    {
                        tableData.map(
                            (data:GenericTableData) => {
                                return (
                                    <TableWithTitle
                                        title={data.title}
                                        columnHeadersStr={data.column_headers}
                                        rowsStr={data.rows}
                                        tableClassName="cotm-twt"
                                    />
                                )
                            }
                        )
                    }
                </div>
            </div>
        </div>
    );
}