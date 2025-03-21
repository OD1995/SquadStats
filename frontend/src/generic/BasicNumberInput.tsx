import { ChangeEvent } from "react";
import "./BasicNumberInput.css";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

interface OwnProps {
    value: number | null;
    setValue: (updater: (prevValue: number) => number) => void; // Use function updater
    className?:string
}

export const BasicNumberInput = (props: OwnProps) => {
    const onChangeVal = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (!isNaN(newValue)) {
            props.setValue(() => newValue); // Ensure it updates correctly
        }
    };

    return (
        <div className={"bni-parent" + ((props.className != undefined) ? ` ${props.className}` : "")}>
            <AddCircle
                className="bni-button ss-green-button"
                onClick={() => props.setValue((prev) => (prev ?? 0) + 1)}
            />
            <input
                className="bni-input input-padder"
                type="number"
                value={props.value ?? 0}
                onChange={onChangeVal}
            />
            <RemoveCircle
                className="bni-button ss-red-button"
                onClick={() => props.setValue((prev) => Math.max((prev ?? 0) - 1, 0))}
            />
        </div>
    );
};
