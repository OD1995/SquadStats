import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { getUserLS } from "../../../authentication/auth";
import { generateId, getBigTitle, getIsClubAdmin } from "../../../helpers/other";
import { Team } from "../../../types/Team";
import { TeamLinkBar } from "../generic/TeamLinkBar";
import { ChangeEvent, useState } from "react";
import { MANUAL_DATA_ENTRY_ACTION_TYPE } from "../../../types/enums";
import "./ManualDataEntry.css";
import { SeasonSelection } from "../../../generic/SeasonSelection";
import { Season } from "../../../types/Season";
import { ButtonDiv } from "../../../generic/ButtonDiv";

interface OwnProps {
    team:Team
    seasons:Season[]
    selectedSeason:string
    setSelectedSeason:Function
}

export const ManualDataEntry = (props:OwnProps) => {

    const [manualDataEntryActionType, setManualDataEntryActionType] = useState<string>();
    const [newSeasonName, setNewSeasonName] = useState<string>("");

    const user = getUserLS();

    const handleRadioButtonChange = (event:ChangeEvent<HTMLInputElement>) => {
        setManualDataEntryActionType(event.target.value);
    }

    const getRadioButtonOptions = () => {
        var options = [
            MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_SEASON
        ];
        if (props.seasons.length > 0) {
            options = options.concat(
                [
                    MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_MATCH,
                    MANUAL_DATA_ENTRY_ACTION_TYPE.EDIT_MATCH
                ]
            )
        }
        return options.map(
            (option:MANUAL_DATA_ENTRY_ACTION_TYPE) => (
                <FormControlLabel
                    value={option}
                    control={<Radio/>}
                    label={option}
                    key={generateId()}
                />
            )
        )
    }

    const onChangeText = (e:ChangeEvent<HTMLInputElement>) => {
        setNewSeasonName(e.target.value);
    }

    const handleNewSeasonButtonClick = () => {

    }

    return (
        <div className='page-parent'>
            {getBigTitle(props.team.team_name)}
            <TeamLinkBar
                team={props.team}
                clubId={props.team.club_id}
                isClubAdmin={getIsClubAdmin(user, props.team.club_id)}
            />
            <div id='manual-data-entry-type-option'>
                <FormControl>
                    <FormLabel disabled={true}>
                        What do you want to do?
                    </FormLabel>
                    <RadioGroup
                        name="controlled-radio-buttons-group"
                        value={manualDataEntryActionType}
                        onChange={handleRadioButtonChange}
                    >
                        {getRadioButtonOptions()}
                    </RadioGroup>
                </FormControl>
            </div>
            {
                (
                    (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_MATCH) ||
                    (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.EDIT_MATCH)
                ) && (
                    <SeasonSelection
                        seasons={props.seasons}
                        selectedSeason={props.selectedSeason}
                        setSelectedSeason={props.setSelectedSeason}
                        flexDirection="row"
                    />
                )
            }
            {
                (manualDataEntryActionType == MANUAL_DATA_ENTRY_ACTION_TYPE.ADD_NEW_SEASON) && (
                    <div id='new-season-input'>
                        <input
                            id='new-season-name-input'
                            placeholder="Enter new season name"
                            value={newSeasonName}
                            onChange={onChangeText}
                        />
                        <ButtonDiv
                            buttonText="Submit"
                            onClickFunction={handleNewSeasonButtonClick}
                        />
                    </div>
                )
            }
        </div>
    );
}