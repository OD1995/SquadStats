import { ChangeEvent } from "react";
import "./NumberInput.css";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

interface OwnProps {
    value:number
    setValue:Function
    className?:string
}

export const NumberInput = (props:OwnProps) => {

    const handleIncreaseClick = () => {
        props.setValue(props.value + 1);
    }

    const handleDecreaseClick = () => {
        if (props.value > 0) {
            props.setValue(props.value - 1);
        }
    }

    const handleInputChange = (event:ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(event.target.value);
        if (Number.isNaN(val)) {
            props.setValue();
        } else {
            props.setValue(val);
        }
    }

    return (
        <div
            id='number-input2'
            className={props.className}
        >
            <input
                id='number-input-input'
                type='number'
                value={props.value}
                onChange={handleInputChange}
            />
            <div id='number-input-buttons'>
                <AddCircle
                    id='increase-value-button'
                    className="change-value-button ss-green-button"
                    onClick={handleIncreaseClick}
                />
                <RemoveCircle
                    id='decrease-value-button'
                    className="change-value-button ss-red-button"
                    onClick={handleDecreaseClick}
                />
            </div>
        </div>
    )
}