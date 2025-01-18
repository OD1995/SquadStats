import { NumberInput } from "../../NumberInput";

interface OwnProps {
    minApps:number
    setMinApps:Function
}

export const MinAppsFilter = (props:OwnProps) => {

    // const handleSelect = (event:SelectChangeEvent) => {
    //     props.setMinApps(event.target.value as string);
    // }

    return (
        <div
            id="min-apps-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Min Apps
            </strong>
            {/* <FormControl> */}
            <NumberInput
                value={props.minApps}
                // onChange={(_, val) => props.setMinApps(val)}
                setValue={props.setMinApps}
                className="filter-select"
            />
            {/* </FormControl> */}
        </div>
    );
}