import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBigTitle, getIsClubAdmin, getTeam } from "../../../helpers/other";
import { Team } from "../../../types/Team";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { Table } from "../../../generic/Table";
import { TableCell, TableRow } from "@mui/material";
import { TeamName } from "../../../types/TeamName";
import { EditTeamNameTable } from "./EditTeamNameTable";
import "./TeamNames.css";
import { getUserLS } from "../../../authentication/auth";
import { TeamLinkBar } from "../generic/TeamLinkBar";

export const TeamNames = () => {
    
    const [team, setTeam] = useState<Team>();
    const [teamNames, setTeamNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

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
            TeamService.getTeamNames(
                teamId!
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        setTeamNames(res.data);
                        setDataLoaded(true);
                    } else {
                        setErrorMessage(res.data.message);
                    }
                }
            )
        },
        []
    )

    const generateHeaders = () => {
        return (
            <TableRow className="ss-table-head">
                <TableCell>
                    Team Name
                </TableCell>
                <TableCell>
                    Is Default Name
                </TableCell>
            </TableRow>
        )
    }

    const generateTeamNameRow = (teamName:TeamName) => {
        return (
            <TableRow>
                <TableCell>
                    {teamName.team_name}
                </TableCell>
                <TableCell>
                    {teamName.is_default_name ? "yes" : "no"}
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div id='club-overview-parent-div' className="page-parent">
            {getBigTitle(team?.team_name)}
            <TeamLinkBar
                isClubAdmin={getIsClubAdmin(user, teamId!)}
                team={team!}
                clubId={team?.club_id!}
            />
            <div id='team-names-content'>
                <div className="error-message">
                    {errorMessage}
                </div>
                {
                    dataLoaded && (
                        editMode ? (
                            <EditTeamNameTable
                                teamNames={teamNames}
                                generateHeaders={generateHeaders}
                                setErrorMessage={setErrorMessage}
                                setEditMode={setEditMode}
                                teamId={teamId!}
                                setTeamNames={setTeamNames}
                            />
                        ) : (
                            <>
                                <Table
                                    headers={generateHeaders()}
                                    rows={teamNames.map((teamName:TeamName) => generateTeamNameRow(teamName))}
                                    className="team-name-not-editable-table"
                                />
                                <button
                                    className='team-names-edit-button'
                                    onClick={() => setEditMode(!editMode)}
                                >
                                    Edit
                                </button>
                            </>
                        )
                    )                    
                }
            </div>
        </div>
    )
}