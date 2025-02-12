import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { METRIC } from "../../../types/enums";

interface OwnProps {
    metric:string
    setMetric:Function
}

export const MetricFilter = (props:OwnProps) => {
    
    const handleSelect = (event:SelectChangeEvent) => {
        props.setMetric(event.target.value as string);
    }

    const options = [
        METRIC.APPEARANCES,
        METRIC.GOALS
    ];

    return (
        <div
            id="split-by-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Metric
            </strong>
            <FormControl>
                <Select
                    value={props.metric}
                    onChange={handleSelect}
                    // label='Type'
                    className="filter-select"
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                >
                    {
                        options.map(
                            (option:string) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                    className="select-menu-item"
                                >
                                    {option}
                                </MenuItem>
                            )
                        )
                    }
                </Select>
            </FormControl>
        </div>
    );
}