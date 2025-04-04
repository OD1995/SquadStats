import { Club } from "../../../types/Club";
import { METRIC, SPLIT_BY_TYPE } from "../../../types/enums";
import { Team } from "../../../types/Team";
import { SplitByFilter } from "../filters/SplitByFilter";
import { CheckboxFilter } from "./CheckboxFilter";
import { MetricFilter } from "./MetricFilter";

interface OwnProps {
    metric:string
    setMetric:Function
    perGame:boolean
    setPerGame:Function
    splitBy:string
    setSplitBy:Function
    team?:Team
    club?:Club
}

export const LeaderboardTypeFilter = (props:OwnProps) => {

    const perGameMetrics = [
        METRIC.GOALS,
        METRIC.HATTRICKS,
        METRIC.POTM,
        METRIC.CLEAN_SHEETS,
        ...((props.team?.team_id == import.meta.env.VITE_ORDOB_TEAM_ID) ? [METRIC.X_SHREK] : [])
    ].map(
        (met:METRIC) => met.valueOf()
    );

    const splitByOptions = [
        SPLIT_BY_TYPE.NA,
        SPLIT_BY_TYPE.SEASON,
        SPLIT_BY_TYPE.YEAR
    ];

    return (
        <div>
            <MetricFilter
                metric={props.metric}
                setMetric={props.setMetric}
            />
            {
                (perGameMetrics.includes(props.metric)) && (
                    <CheckboxFilter
                        isTicked={props.perGame}
                        setIsTicked={props.setPerGame}
                        label={"Per Game"}
                    />
                )
            }
            <SplitByFilter
                splitBy={props.splitBy}
                setSplitBy={props.setSplitBy}
                splitByOptions={splitByOptions}
            />
        </div>
    );
}