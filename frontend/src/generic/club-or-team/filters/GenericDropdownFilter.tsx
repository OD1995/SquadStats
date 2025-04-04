import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { GenericOption } from "../../../types/GenericOption";

interface OwnProps {
    options:GenericOption[]
    title:string
    selectedOption:string
    setSelectedOption:Function
}

export const GenericDropdownFilter = (props:OwnProps) => {

    const handleSelect = (event:SelectChangeEvent) => {
        props.setSelectedOption(event.target.value as string);
    }

    return (
        <div className="match-filter">
            <strong className="filter-select-title">
                {props.title}
            </strong>
            <FormControl>
                <Select
                    value={props.selectedOption}
                    onChange={handleSelect}
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                    className="filter-select"
                >
                    {
                        [
                            {
                                label: "",
                                value: ""
                            } as GenericOption
                        ].concat(props.options).map(
                            (option:GenericOption) => {
                                return (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
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