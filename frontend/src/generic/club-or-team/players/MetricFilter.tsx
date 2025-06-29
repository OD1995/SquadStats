import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { METRIC } from "../../../types/enums";
import { Team } from "../../../types/Team";
import { QuestionMark } from "@mui/icons-material";
import { useState } from "react";
import { Modal } from "../../Modal";

interface OwnProps {
    metric:string
    setMetric:Function
    team?:Team
    setPerGame:Function
    setSplitBy:Function
}

export const MetricFilter = (props:OwnProps) => {

    const [showMetricExplainerModal, setShowMetricExplainerModal] = useState<boolean>(false);
    
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
        METRIC.IMPACT_GOALS,
        METRIC.IMPACT_GOAL_RATIO,
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

    const impactGoalsContent = (
        <div>
            <h2>Impact Goals / Impact Goal Ratio</h2>
            <h3>Description</h3>
            <p>
                <b><i>Impact Goals</i></b> is a metric designed to track the impact of goals scored.
            </p>
            <p>
                In short, goals scored in draws and narrow wins are valued
                more highly than goals scored in losses and blowout wins.
            </p>
            <p>
                <b><i>Impact Goal Ratio</i></b> is Impact Goals divided by (normal) Goals.
            </p>
            <p>
                A higher score suggests the player scores more impactful goals on average.
            </p>
            <p>
                For example, a score of 1 would mean every goal scored was the winner in a 1-0 victory.
            </p>
            <p>
                While a score of 0.1 would mean every goal scored was during a loss or blowout (10+ goal) win.
            </p>
            <h3>Calculation</h3>
            <p>
                Goals are valued based on the match's final result, using the formula 1/<i>x</i>,
                where <i>x</i> is defined below:
            </p>
            <p>
                <i>Wins - x</i> = margin of victory, capped at 10. The bigger the win, the smaller the goal value.
            </p>
            <p>
                <i>Draws - x</i> = 3. Reflects the difference in value of a win-securing goal and a draw-securing goal.
            </p>
            <p>
                <i>Losses - x</i> = 10. Goals in losses have minimum impact, equal to a goal in a 10-0 win.
            </p>
        </div>
    )

    return (
        <div
            id="split-by-filter"
            className="match-filter"
        >
            {
                showMetricExplainerModal && (
                    <Modal
                        handleModalClose={() => setShowMetricExplainerModal(false)}
                        content={impactGoalsContent}
                    />
                )
            }
            <strong className="filter-select-title">
                Metric
            </strong>
            <FormControl>
                <div
                    style={{display:"flex", alignItems:"center"}}
                >
                    <Select
                        value={props.metric}
                        onChange={handleSelect}
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
                    {
                        (
                            (props.metric == METRIC.IMPACT_GOALS) ||
                            (props.metric == METRIC.IMPACT_GOAL_RATIO)
                        ) && (
                            <QuestionMark
                                onClick={() => setShowMetricExplainerModal(true)}
                                sx={{cursor:"pointer"}}
                            />
                        )
                    }
                </div>
            </FormControl>
        </div>
    );
}