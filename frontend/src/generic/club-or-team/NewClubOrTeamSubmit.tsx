import { FormControl, TextField } from "@mui/material"
import { ChangeEvent, ReactNode, useState } from "react"
import { EntryLabelWithQuestionMark } from "../EntryLabelWithQuestionMark";
import ClubService from "../../services/ClubService";
import { CLUB_TYPE, DATA_SOURCE } from "../../types/enums";
import { BackendResponse } from "../../types/BackendResponse";
import { useDispatch } from "react-redux";
import { triggerRefresh } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { getUserLS, setUserLS } from "../../authentication/auth";
import TeamService from "../../services/TeamService";
import { User } from "../../types/User";
import { getClub, reverseEngineerShareId } from "../../helpers/other";
import { Club } from "../../types/Club";
import { Team } from "../../types/Team";

interface OwnProps {
    clubType?:CLUB_TYPE
    dataSource?:DATA_SOURCE|null
    labelText:string
    modalContent?:ReactNode
    club?:boolean
    team?:boolean
}

export const NewClubOrTeamSubmit = (props:OwnProps) => {

    const [textValue, setTextValue] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = getUserLS();

    const handleSubmit = () => {
        setButtonDisabled(true);
        if (props.club) {
            if (props.clubType! == CLUB_TYPE.ALREADY_EXISTS) {
                const shareId = reverseEngineerShareId(textValue);
                const clubIdArray = user?.clubs.map(
                    (club:Club) => club.club_id
                )
                if (clubIdArray?.includes(shareId)) {
                    setErrorMessage("Your account is already linked to this club")
                    setButtonDisabled(false);
                    return;
                }
            } else if (props.clubType! == CLUB_TYPE.COMPLETELY_NEW) {
                const clubNameArray = user?.clubs.map(
                    (club:Club) => club.club_name
                )
                if (clubNameArray?.includes(textValue)) {
                    setErrorMessage("Your account is already link to a club with the same name");
                    setButtonDisabled(false);
                    return;
                }
            }
            ClubService.createNewClub(
                props.clubType!,
                props.dataSource!,
                (props.dataSource != DATA_SOURCE.MANUAL) ? textValue : null,
                (props.dataSource == DATA_SOURCE.MANUAL) ? textValue : null
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        const user = res.data.ss_user as User;
                        setUserLS(user);
                        dispatch(triggerRefresh());
                        navigate(`/club/${res.data.new_club_id}/overview`);
                    } else {
                        setErrorMessage(res.data.message)
                    }
                    setButtonDisabled(false);
                }
            )
        }
        if (props.team) {
            const clubId = window.location.pathname.split("/")[2];
            const teamNameArray = getClub(user, clubId)!.teams.map(
                (team:Team) => team.team_name
            );
            if (teamNameArray.includes(textValue)) {
                setErrorMessage("This club already has a team with the same name linked to it");
                setButtonDisabled(false);
                return;
            }
            TeamService.createNewTeam(
                clubId,
                textValue
            ).then(
                (res:BackendResponse) => {
                    if (res.success) {
                        const user = res.data.ss_user as User;
                        setUserLS(user);
                        dispatch(triggerRefresh());
                        navigate(`/team/${res.data.new_team_id}/overview`);
                    } else {
                        setErrorMessage(res.data.message)
                    }
                    setButtonDisabled(false);
                }
            )
        }
    }

    const handleTextValueChange = (event:ChangeEvent<HTMLInputElement>) => {
        setTextValue(event.target.value);
    }

    return (
        <div
            id='new-cot-submit-parent'
            className="new-cot-entry-parent add-cot-section"
        >
            <p className="error-message">
                {errorMessage}
            </p>
            <FormControl
                id='new-cot-submit-form'
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
        </div>
    )
}