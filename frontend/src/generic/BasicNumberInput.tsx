import { ChangeEvent } from "react";
import "./BasicNumberInput.css";

interface OwnProps {
    value:number
    setValue:Function
}

export const BasicNumberInput = (props:OwnProps) => {

    
    const onChangeVal = (e:ChangeEvent<HTMLInputElement>) => {
        props.setValue(e.target.value);
    }

    return (
        <div className='bni-parent'>
            <button
                className="bni-button ss-green-button"
                onClick={() => props.setValue(Math.max(props.value + 1))}
            >
                +
            </button>
            <input
                className='bni-input'
                type="number"
                value={props.value}
                onChange={onChangeVal}
            />
            <button
                className="bni-button ss-red-button"
                onClick={() => props.setValue(Math.max(props.value - 1, 0))}
            >
                -
            </button>
        </div>
    );
}