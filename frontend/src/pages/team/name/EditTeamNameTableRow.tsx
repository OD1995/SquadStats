import { Switch, TableCell, TableRow, TextField } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"

interface EditTeamNameTableRow {
    ix:number
    team_name:string
    is_default_name:boolean
    updateTeamName:Function
    handleSwitchClick:Function
}

export const EditTeamNameTableRow = (props:EditTeamNameTableRow) => {

    const [teamNameEditable, setTeamNameEditable] = useState<boolean>(false);
    const [editedText, setEditedText] = useState<string>("");

    const handleTextValueChange = (event:ChangeEvent<HTMLInputElement>) => {
        setEditedText(event.target.value);
    }

    const makeNameEditable = () => {
        setEditedText(props.team_name);
        setTeamNameEditable(true);
    }

    const handleUpdateTeamNameClick = () => {
        props.updateTeamName(props.ix,editedText);
        setTeamNameEditable(false);
    }

    useEffect(
        () => {
            if (props.team_name == "") {
                // setEditedText("");
                setTeamNameEditable(true);
            }
            //  else {
            //     setEditTeamName(false);
            // }
        },
        []
    )

    return (
        <TableRow>
            <TableCell className="teamn-name-cell">
                {
                    teamNameEditable ? (
                        <>
                            <TextField
                                value={editedText}
                                onChange={handleTextValueChange}
                            />
                            <div className="team-name-edit-button-parent">
                                <button
                                    className="ss-green-button team-name-edit-button"
                                    onClick={handleUpdateTeamNameClick}
                                >
                                    Update
                                </button>                        
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                {props.team_name}
                            </div>
                            <div className="team-name-edit-button-parent">
                                <button
                                    className="ss-green-button team-name-edit-button"
                                    onClick={makeNameEditable}
                                >
                                    Edit
                                </button>
                            </div>
                        </>
                    )
                }
            </TableCell>
            <TableCell>
                <Switch
                    checked={props.is_default_name}
                    onChange={() => props.handleSwitchClick(props.ix)}
                />
            </TableCell>
        </TableRow>
    )
}