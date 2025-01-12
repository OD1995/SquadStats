import { Checkbox } from "@mui/material";

interface OwnProps {
    isTicked:boolean
    setIsTicked:Function
    label:string
}

export const CheckboxFilter = (props:OwnProps) => {
    return (
        <div className='match-filter'>            
            <strong className="filter-select-title">
                {props.label}
            </strong>
            <Checkbox
                checked={props.isTicked}
                onChange={() => props.setIsTicked(!props.isTicked)}
                className="filter-select"
            />
        </div>
    );
}