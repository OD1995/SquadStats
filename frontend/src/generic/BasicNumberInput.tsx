import { ChangeEvent } from "react";
import "./BasicNumberInput.css";

interface OwnProps {
    value: number | null;
    setValue: (updater: (prevValue: number) => number) => void; // Use function updater
}

export const BasicNumberInput = (props: OwnProps) => {
    const onChangeVal = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (!isNaN(newValue)) {
            props.setValue(() => newValue); // Ensure it updates correctly
        }
    };

    return (
        <div className="bni-parent">
            <button
                className="bni-button ss-green-button"
                onClick={() => props.setValue((prev) => (prev ?? 0) + 1)}
            >
                +
            </button>
            <input
                className="bni-input"
                type="number"
                value={props.value ?? 0}
                onChange={onChangeVal}
            />
            <button
                className="bni-button ss-red-button"
                onClick={() => props.setValue((prev) => Math.max((prev ?? 0) - 1, 0))}
            >
                -
            </button>
        </div>
    );
};
