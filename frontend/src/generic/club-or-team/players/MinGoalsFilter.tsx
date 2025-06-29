import { NumberInput } from "../../NumberInput";

interface OwnProps {
    minGoals:number
    setMinGoals:Function
}

export const MinGoalsFilter = (props:OwnProps) => {

    // const handleSelect = (event:SelectChangeEvent) => {
    //     props.setMinApps(event.target.value as string);
    // }

    return (
        <div
            id="min-goals-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Min Goals
            </strong>
            <NumberInput
                value={props.minGoals}
                setValue={props.setMinGoals}
                className="filter-select"
            />
        </div>
    );
}