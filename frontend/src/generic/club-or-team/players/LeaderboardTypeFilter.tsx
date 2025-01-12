import { METRIC, SPLIT_BY_TYPE } from "../../../types/enums";
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
}

export const LeaderboardTypeFilter = (props:OwnProps) => {

    const perGameMetrics = [
        METRIC.GOALS
    ].map(
        (met:METRIC) => met.valueOf()
    );

    const splitByOptions = [
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