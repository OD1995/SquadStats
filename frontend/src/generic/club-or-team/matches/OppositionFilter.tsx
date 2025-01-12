import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";

interface OwnProps {
    selectedOpposition:string
    setSelectedOpposition:Function
    oppositionOptions:string[]
}

export const OppositionFilter = (props:OwnProps) => {

    const handleSelect = (event:SelectChangeEvent) => {
        props.setSelectedOpposition(event.target.value as string);
    }

    return (
        <div
            id="match-type-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Opposition
            </strong>
            <FormControl>
                {/* <InputLabel>
                    Type
                </InputLabel> */}
                <Select
                    value={props.selectedOpposition}
                    onChange={handleSelect}
                    label='Opposition'
                    className="filter-select"
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                >
                    {
                        props.oppositionOptions.map(
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