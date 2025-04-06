import { Table } from "../../../generic/Table"
import { TeamName } from "../../../types/TeamName"
import TeamService from "../../../services/TeamService"
import { EditTeamNameTableRow } from "./EditTeamNameTableRow"
import { useEffect, useState } from "react"
import { toEntries } from "../../../helpers/other"
import { BackendResponse } from "../../../types/BackendResponse"

interface EditTeamNameTableProps {
    teamNames:TeamName[]
    generateHeaders:Function
    setErrorMessage:Function
    setEditMode:Function
    teamId:string
    setTeamNames:Function
}

export const EditTeamNameTable = (props:EditTeamNameTableProps) => {

    const [rows, setRows] = useState<TeamName[]>([]);

    useEffect(
        () => {
            setRows(props.teamNames);
            console.log("editTeamNameTable useEffect")
        },
        []
    )

    const handleSwitchClick = (ix:number) => {
        const currentVal = rows[ix].is_default_name;
        const newVal = !currentVal;
        if (newVal == true) {
            setRows(
                (oldRows) => {
                    var newRows = [...oldRows];
                    for (const [idx,_] of toEntries(newRows)) {
                        newRows[idx].is_default_name = (idx == ix);
                    }
                    return newRows;
                }
            )
        } else {
            setRows(
                (oldRows) => {
                    var newRows = [...oldRows];
                    for (const [idx,_] of toEntries(newRows)) {
                        newRows[idx].is_default_name = false;
                    }
                    return newRows;
                }
            )
        }
    }

    const updateTeamName = (ix:number, newTeamName:string) => {
        setRows(
            (oldRows) => {
                var newRows = [...oldRows];
                newRows[ix].team_name = newTeamName;
                return newRows;
            }
        )
    }

    const generateRow = (teamName:TeamName, ix:number) => {
        return (
            <EditTeamNameTableRow
                ix={ix}
                team_name={teamName.team_name}
                is_default_name={teamName.is_default_name}
                updateTeamName={updateTeamName}
                handleSwitchClick={handleSwitchClick}
            />
        )
    }

    const getTrueCount = () => {
        var count = 0;
        for (const row of rows) {
            if (row.is_default_name) {
                count += 1;
            }
        }
        return count;
    }

    const handleSaveClick = () => {
        const trueCount = getTrueCount();
        if (trueCount == 0) {
            props.setErrorMessage("At least one of the team names must be set as the default team name")
            return;
        }
        TeamService.saveTeamNames(rows)
        .then(
            (response:BackendResponse) => {
                if (response.success) {
                    props.setTeamNames(response.data);
                    props.setEditMode(false);
                } else {
                    props.setErrorMessage(response.data.message);
                }
            }
        )
    }

    const handleNewTeamNameClick = () => {
        setRows(oldRows => [...oldRows, {
            is_default_name: false,
            team_id: props.teamId,
            team_name: "",
        }])
    }

    return (
        <>
            <Table
                headers={props.generateHeaders()}
                rows={rows.map((teamName:TeamName, ix:number) => generateRow(teamName,ix))}

            />
            <div>
                <button
                    className='team-names-edit-button'
                    onClick={handleNewTeamNameClick}
                >
                    Add New Team Name
                </button>
                <button
                    className='team-names-edit-button'
                    onClick={handleSaveClick}
                >
                    Save
                </button>
            </div>
        </>
    )
}