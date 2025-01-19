import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { Link } from "react-router-dom";
import "./OverviewSelector.css";

export interface OverviewOption {
    value:string
    label:string
}

interface OwnProps {
    label:string
    overviewId:string
    setOverviewId:Function
    overviewOptions:OverviewOption[]
    link:string
}

export const OverviewSelector = (props:OwnProps) => {

    const handleSelect = (event:SelectChangeEvent) => {
        props.setOverviewId(event.target.value as string);
    }

    return (
        <div
            // id="player-filter"
            className="overview-selector"
        >
            <div className="overview-selector-top-row overview-selector-row">
                <strong className="filter-select-title">
                    {props.label}
                </strong>
                <FormControl>
                    <Select
                        value={props.overviewId}
                        onChange={handleSelect}
                        input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                        className="filter-select"
                    >
                        {
                            props.overviewOptions.map(
                                (option:OverviewOption) => {
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
            <div className="overview-selector-bottom-row overview-selector-row">
                <Link to={props.link}>
                        <button className="ss-green-button">
                            Select
                        </button>
                </Link>
            </div>
         </div>
    );
}