import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FilterType } from "../../../types/enums";

interface OwnProps {
    type:string
    setType:Function
}

export const MatchTypeFilter = (props:OwnProps) => {

    const handleTypeSelect = () => {
        props.setType()
    }

    const options = [
        FilterType.H2H,
        FilterType.PPG_BY_PLAYER_COUNT
    ]

    return (
        <div
            id="match-type-filter"
            className="match-filter"
        >
            <strong>Type</strong>
            <FormControl>
                <InputLabel id="demo-simple-select-label">
                    Type
                </InputLabel>
                <Select
                    value={props.type}
                    onChange={handleTypeSelect}
                    label='Type'
                >
                    {
                        options.map(
                            (option:string) => {
                                return (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </MenuItem>
                                )
                            }
                        )
                    }
                </Select>
            </FormControl>
        </div>
    );
}