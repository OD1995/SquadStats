import { FormControl, TextField } from "@mui/material"
import { ReactNode, useState } from "react"
import { EntryLabelWithQuestionMark } from "../../generic/EntryLabelWithQuestionMark";
import ClubService from "../../services/ClubService";
import { CLUB_TYPE } from "../../types/enums";
import { BackendResponse } from "../../types/BackendResponse";

interface NewClubSubmitProps {
    clubType:CLUB_TYPE
    labelText:string
    modalContent:ReactNode
}

export const NewClubSubmit = (props:NewClubSubmitProps) => {

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = () => {
        ClubService.createNewClub(
            props.clubType,
            null
        ).then(
            (res:BackendResponse) => {

            }
        )
    }

    return (
        <div id='new-club-submit-parent' className="new-club-entry-parent">
            <FormControl>
                <EntryLabelWithQuestionMark
                    labelText={props.labelText}
                    modalContent={props.modalContent}
                />
                <TextField
                    variant="outlined"
                />
            </FormControl>
            <button
                className={"ss-green-button" + (buttonDisabled ? " disabled-button" : "")}
                onClick={() => handleSubmit()}
                disabled={buttonDisabled}
            >
                Submit
            </button>
            <p>
                {errorMessage}
            </p>
        </div>
    )
}