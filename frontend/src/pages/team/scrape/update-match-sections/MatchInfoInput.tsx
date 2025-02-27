import { useEffect, useState } from "react";
import { Match } from "../../../../types/Match";

interface OwnProps {
    match:Match
    setMatch:Function
}

export const MatchInfoInput = (props:OwnProps) => {

    const [labels, setLabels] = useState<string[]>();
    const [inputs, setInputs] = useState<JSX.Element[]>();
    const [showPens, setShowPens] = useState<boolean>(false);

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
                <input></input>,
                <input></input>,
                <input></input>,
                <input></input>,
                <input></input>,
                <input></input>,
                <input type='checkbox' checked={showPens} onClick={() => setShowPens(!showPens)} />
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
        [showPens]
    )

    return (
        <div id='match-info-input'>
            <div id='match-info-input-labels' className="match-info-input-div">
                {
                    labels?.map(
                        (lab:string) => (
                            <b className="match-info-input-row">
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
                            <div className="match-info-input-row">
                                {inp}
                            </div>
                        )
                    )
                }
            </div>
        </div>
    );
}