import { ClubLinkBar } from "../../pages/club/generic/ClubLinkBar";
import { TeamLinkBar } from "../../pages/team/generic/TeamLinkBar";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";
import "./ClubOrTeamMatchesOrPlayers.css";
import { GenericTableData } from "../../types/GenericTableTypes";
import { useEffect, useState } from "react";
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
    isLoadng?:boolean
    errorMessage:string
    setErrorMessage:Function
}

export const ClubOrTeamMatchesOrPlayers = (props:OwnProps) => {

    const [tableData, setTableData] = useState<GenericTableData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(
        () => {
            if (props.isLoadng) {
                setIsLoading(props.isLoadng);
            }
        },
        []
    )

    return (
        <div id='cot-mop-parent' className="page-parent">
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
                            team={props.team!}
                        />
                    )
                }
                {
                    props.matches && (
                        <MatchesFilter
                            club={props.club}
                            team={props.team}
                            setErrorMessage={props.setErrorMessage}
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
                            setErrorMessage={props.setErrorMessage}
                            setTableData={setTableData}
                            setIsLoading={setIsLoading}
                        />
                    )
                }
                <div className="error-message">
                    {props.errorMessage}
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
                                        rowsPerPage={15}
                                        {...data}
                                        // column_ratio={[1,31,15,15,19,19]}
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