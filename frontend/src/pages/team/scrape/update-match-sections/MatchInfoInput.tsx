import { useEffect, useState } from "react";
import { Match } from "../../../../types/Match";
import { generateId } from "../../../../helpers/other";
import { BasicNumberInput } from "../../../../generic/BasicNumberInput";

interface OwnProps {
    match:Match
    setMatch:Function
}

export const MatchInfoInput = (props:OwnProps) => {

    const [labels, setLabels] = useState<string[]>();
    const [inputs, setInputs] = useState<JSX.Element[]>();
    const [showPens, setShowPens] = useState<boolean>(false);

    const updateMatch = (key:string, newVal:number|string) => {
        const property = key as keyof typeof props.match;
        props.setMatch(
            (prevVal:Match) => (
                {
                    ...prevVal,
                    [property]: newVal
                }
            )
        )
        const a = 1;
    }

    // const increment = (metric:string) => {
    //     const property = metric as keyof typeof props.match;
    //     const currentVal = props.match[property] ?? 0;
    //     const newVal = currentVal + 1;
    //     props.setMatch(
    //         (prevVal:Match) => {
    //             if (typeof prevVal[property] == 'number') {
    //                 return {
    //                     ...prevVal,
    //                     [property]: currentVal + 1
    //                 };
    //             }
    //         )
    //     }
    // }
    // const increment = (key:string) => {
    //     const property = key as keyof typeof props.match;
    //     props.setMatch(
    //         (prevState:Match) => {
    //             if (typeof prevState[property] === "number") {
    //                 const currentVal = prevState[property] ?? 0;
    //                 return { ...prevState, [key]: currentVal + 1 };
    //             }
    //             return prevState; // Return unchanged state if not a number
    //         }
    //     );
    // }

    // const decrement = (key:string) => {
    //     const property = key as keyof typeof props.match;
    //     props.setMatch(
    //         (prevState:Match) => {
    //             if (typeof prevState[property] === "number") {
    //                 const currentVal = prevState[property] ?? 0;
    //                 return { ...prevState, [key]: currentVal - 1 };
    //             }
    //             return prevState; // Return unchanged state if not a number
    //         }
    //     );
    // }

    useEffect(
        () => {
            var _labels_ = [
                "Date",
                "Time",
                "Location",
                "Opponent",
                "Goals For",
                "Goals Against",
                "Penalties?"
            ];
            var _inputs_ = [
                <input type='date'/>, // date
                <input type='time'/>, // time
                <input/>, // location
                <input/>, // opponent
                <BasicNumberInput
                    value={props.match?.goals_for}
                    setValue={(newVal:number) => updateMatch('goals_for',newVal)}
                />, // goals for
                <BasicNumberInput
                    value={props.match?.goals_against}
                    setValue={(newVal:number) => updateMatch('goals_against',newVal)}
                />, // goals against
                <input type='checkbox'/>// checked={showPens} onClick={() => setShowPens(!showPens)} />
            ]
            if (showPens) {
                _labels_ = _labels_.concat(
                    [
                        "Penalties For",
                        "Penalties Against"
                    ]
                )
                _inputs_ = _inputs_.concat(
                    [
                        <input></input>,
                        <input></input>,
                    ]
                )
            }
            setLabels(_labels_);
            setInputs(_inputs_);
        },
        [showPens, props.match]
    )

    return (
        <div id='match-info-input'>
            <div id='match-info-input-labels' className="match-info-input-div">
                {
                    labels?.map(
                        (lab:string) => (
                            <b className="match-info-input-row" key={generateId()}>
                                {lab}
                            </b>
                        )
                    )
                }
            </div>
            <div id='match-info-input-inputs' className="match-info-input-div">
                {
                    inputs?.map(
                        (inp:JSX.Element) => (
                            <div className="match-info-input-row" key={generateId()}>
                                {inp}
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}