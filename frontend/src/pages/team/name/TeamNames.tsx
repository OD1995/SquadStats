import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTeam } from "../../../helpers/other";
import { useSelector } from "react-redux";
import { userSelector } from "../../../store/slices/userSlice";
import { Team } from "../../../types/Team";
import TeamService from "../../../services/TeamService";
import { BackendResponse } from "../../../types/BackendResponse";
import { Table } from "../../../generic/Table";
import { TableCell, TableRow } from "@mui/material";
import { TeamName } from "../../../types/TeamName";
import { EditTeamNameTable } from "./EditTeamNameTable";
import "./TeamNames.css";
import { getUserLS } from "../../../authentication/auth";

export const TeamNames = () => {
    
    const [team, setTeam] = useState<Team>();
    const [teamNames, setTeamNames] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [editMode, setEditMode] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);

    let { teamId } = useParams();
    // const user = useSelector(userSelector);
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
        <div id='club-overview-parent-div'>
            <h1 className="big-h1-title">
                {team?.team_name}
            </h1>
            <div id='club-overview-content'>
                <div>
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
                                />
                                <button
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