import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { SPLIT_BY_TYPE } from "../../../types/enums";

interface OwnProps {
    splitBy:string
    setSplitBy:Function
}

export const SplitByFilter = (props:OwnProps) => {

    const handleTypeSelect = (event:SelectChangeEvent) => {
        props.setSplitBy(event.target.value as string);
    }

    const options = [
        SPLIT_BY_TYPE.NA,
        SPLIT_BY_TYPE.OPPOSITION,
        SPLIT_BY_TYPE.PLAYER_COUNT
    ]

    return (
        <div
            id="split-by-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Split By
            </strong>
            <FormControl>
                <Select
                    value={props.splitBy}
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