import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { METRIC } from "../../../types/enums";
import { Team } from "../../../types/Team";

interface OwnProps {
    metric:string
    setMetric:Function
    team?:Team
    setPerGame:Function
    setSplitBy:Function
}

export const MetricFilter = (props:OwnProps) => {
    
    const handleSelect = (event:SelectChangeEvent) => {
        props.setMetric(event.target.value as string);
        props.setPerGame(false);
        props.setSplitBy("");
    }

    const options = [
        METRIC.APPEARANCES,
        METRIC.GOALS,
        METRIC.HATTRICKS,
        METRIC.POTM,
        METRIC.CLEAN_SHEETS,
        METRIC.CONSECUTIVE_APPS,
        METRIC.CONSECUTIVE_WINS,
        METRIC.CONSECUTIVE_GOALSCORING_MATCHES,
        METRIC.CONSECUTIVE_HATTRICKS,
        METRIC.POINTS_PER_GAME,
        METRIC.GOALS_SCORED,
        METRIC.GOALS_CONCEDED,
        METRIC.GOAL_DIFFERENCE,
        METRIC.DAYS_BETWEEN_APPS,
        ...((props.team?.team_id == import.meta.env.VITE_ORDOB_TEAM_ID) ? [METRIC.X_SHREK] : [])
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