import { FormControl, TextField } from "@mui/material"
import { ChangeEvent, ReactNode, useState } from "react"
import { EntryLabelWithQuestionMark } from "../../generic/EntryLabelWithQuestionMark";
import ClubService from "../../services/ClubService";
import { CLUB_TYPE, DATA_SOURCE } from "../../types/enums";
import { BackendResponse } from "../../types/BackendResponse";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

interface NewClubSubmitProps {
    clubType:CLUB_TYPE
    dataSource:DATA_SOURCE|null
    labelText:string
    modalContent:ReactNode
}

export const NewClubSubmit = (props:NewClubSubmitProps) => {

    const [textValue, setTextValue] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = () => {
        setButtonDisabled(true);
        ClubService.createNewClub(
            props.clubType,
            props.dataSource,
            (props.dataSource != DATA_SOURCE.MANUAL) ? textValue : null,
            (props.dataSource == DATA_SOURCE.MANUAL) ? textValue : null
        ).then(
            (res:BackendResponse) => {
                if (res.success) {
                    dispatch(setUser(res.data.ss_user));
                    navigate(`/club/${res.data.new_club_id}/overview`);
                } else {
                    setErrorMessage(res.data.message)
                }
                setButtonDisabled(false);
            }
        )
    }

    const handleTextValueChange = (event:ChangeEvent<HTMLInputElement>) => {
        setTextValue(event.target.value);
    }

    return (
        <div
            id='new-club-submit-parent'
            className="new-club-entry-parent add-club-section"
        >
            <FormControl
                id='new-club-submit-form'
            >
                <EntryLabelWithQuestionMark
                    labelText={props.labelText}
                    modalContent={props.modalContent}
                />
                <TextField
                    variant="outlined"
                    value={textValue}
                    onChange={handleTextValueChange}
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