import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { QueryType } from "../../../types/enums";

interface OwnProps {
    type:string
    setType:Function
}

export const MatchTypeFilter = (props:OwnProps) => {

    const handleTypeSelect = (event:SelectChangeEvent) => {
        props.setType(event.target.value as string);
    }

    const options = [
        QueryType.MATCH_HISTORY,
        QueryType.H2H,
        QueryType.PPG_BY_PLAYER_COUNT
    ]

    return (
        <div
            id="match-type-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Type
            </strong>
            <FormControl>
                {/* <InputLabel>
                    Type
                </InputLabel> */}
                <Select
                    value={props.type}
                    onChange={handleTypeSelect}
                    label='Type'
                    className="filter-select"
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                >
                    {
                        options.map(
                            (option:string) => {
                                return (
                                    <MenuItem
                                        key={option}
                                        value={option}
                                        className="select-menu-item"
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