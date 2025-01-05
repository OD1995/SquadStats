import { ClubLinkBar } from "../../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../../pages/team/generic/TeamLinkBar";
import { Club } from "../../../types/Club";
import { Team } from "../../../types/Team";
import "./ClubOrTeamMatches.css";
import { MatchesFilter } from "./MatchesFilter";
import { GenericTableData } from "../../../types/GenericTableTypes";
import { useState } from "react";
import { Table } from "../../Table";
import { TableWithTitle } from "../../TableWithTitle";
import { SortableTable } from "../../SortableTable";
import { Loading } from "../../Loading";
import { generateId } from "../../../helpers/other";

interface OwnProps {
    club?:Club
    team?:Team
    isClubAdmin:boolean
    errorMessage:string
    setErrorMessage:Function
}

export const ClubOrTeamMatches = (props:OwnProps) => {

    const [tableData, setTableData] = useState<GenericTableData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
                    setIsLoading={setIsLoading}
                />
                <div>
                    {props.errorMessage}
                </div>
                <div id='cotm-table-content'>
                    {
                        isLoading && <Loading/>
                    }
                    {
                        tableData.map(
                            (data:GenericTableData) => {
                                return (
                                    <SortableTable
                                        key={generateId()}
                                        rowsPerPage={10}
                                        {...data}
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