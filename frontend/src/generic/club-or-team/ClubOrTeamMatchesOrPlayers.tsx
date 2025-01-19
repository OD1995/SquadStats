import { ClubLinkBar } from "../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../pages/team/generic/TeamLinkBar";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";
import "./ClubOrTeamMatchesOrPlayers.css";
import { GenericTableData } from "../../types/GenericTableTypes";
import { useState } from "react";
import { BetterTable } from "../BetterTable";
import { Loading } from "../Loading";
import { generateId, getBigTitle } from "../../helpers/other";
import { MatchesFilter } from "./matches/MatchesFilter";
import { PlayersFilter } from "./players/PlayersFilter";

interface OwnProps {
    club?:Club
    team?:Team
    isClubAdmin:boolean
    matches?:boolean
    players?:boolean
}

export const ClubOrTeamMatchesOrPlayers = (props:OwnProps) => {

    const [tableData, setTableData] = useState<GenericTableData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    return (
        <div id='cot-mop-parent' className="page-parent">
            {/* <h1 className="big-h1-title">
                {props.team?.team_name ?? props.club?.club_name}
            </h1> */}
            {getBigTitle(props.team?.team_name ?? props.club?.club_name)}
            <div id='cot-mop-content'>
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
                    props.matches && (
                        <MatchesFilter
                            club={props.club}
                            team={props.team}
                            setErrorMessage={setErrorMessage}
                            setTableData={setTableData}
                            setIsLoading={setIsLoading}
                        />
                    )
                }
                {
                    props.players && (
                        <PlayersFilter
                            club={props.club}
                            team={props.team}
                            setErrorMessage={setErrorMessage}
                            setTableData={setTableData}
                            setIsLoading={setIsLoading}
                        />
                    )
                }
                <div className="error-message">
                    {errorMessage}
                </div>
                <div id='cotmop-table-content'>
                    {
                        isLoading && <Loading/>
                    }
                    {
                        tableData.map(
                            (data:GenericTableData) => {
                                return (
                                    <BetterTable
                                        key={generateId()}
                                        rowsPerPage={10}
                                        {...data}
                                        titleClassName="small-caps-subtitle  sortable-table-title"
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