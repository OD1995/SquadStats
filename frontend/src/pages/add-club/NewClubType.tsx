import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { ChangeEvent } from "react"
import { CLUB_TYPE } from "../../types/enums"

interface NewClubTypeProps {
    newClubType: string
    setNewClubType: Function
}

export const NewClubType = (props:NewClubTypeProps) => {

    const handleRadioButtonChange = (event:ChangeEvent<HTMLInputElement>) => {
        props.setNewClubType(event.target.value);
    }

    return (
        <div
            id='new-club-type-parent'
            className="add-cot-section"
        >
            <FormControl>
                <FormLabel disabled={true}>
                    What type of new club do you want to add?
                </FormLabel>
                <RadioGroup
                    name="controlled-radio-buttons-group"
                    value={props.newClubType}
                    onChange={handleRadioButtonChange}
                >
                    <FormControlLabel
                        value={CLUB_TYPE.COMPLETELY_NEW}
                        control={<Radio/>}
                        label='I want to create a new club'
                    />
                    <FormControlLabel
                        value={CLUB_TYPE.ALREADY_EXISTS}
                        control={<Radio/>}
                        label='I want to link my account to a club that already exists'
                    />
                </RadioGroup>
            </FormControl>
        </div>
    )
}