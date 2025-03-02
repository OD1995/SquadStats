import React, { useState, useEffect } from "react";
import { Match } from "../../../../types/Match";
import { generateId } from "../../../../helpers/other";
import { BasicNumberInput } from "../../../../generic/BasicNumberInput";
import { MATCH_LOCATION_TYPE } from "../../../../types/enums";
import { Loading } from "../../../../generic/Loading";

interface OwnProps {
    match: Match;
    setMatch: (updater: (prevVal: Match) => Match) => void;
    locations: Record<string, string[]>|undefined
}

export const MatchInfoInput = (props:OwnProps) => {
    const [showPens, setShowPens] = useState<boolean>(false);
    const [locationDropdownVal, setLocationDropdownVal] = useState<string>("");

    // Function to update match properties (supports function updaters)
    const updateMatch = (
        key: keyof Match,
        updater: ((prev: number) => number) | number | string | null
    ) => {
        props.setMatch((prevMatch) => ({
            ...prevMatch,
            [key]: typeof updater === "function"
                ? updater(prevMatch[key] as number ?? 0) // Ensure prev is always a number
                : updater,
        }));
    };

    // Automatically reset penalty values when `showPens` changes
    useEffect(() => {
        updateMatch("pens_for", showPens ? 0 : null);
        updateMatch("pens_against", showPens ? 0 : null);
    }, [showPens]);

    // useEffect(
    //     () => {
    //         console.log(`han: '${props.match.home_away_neutral}'`)
    //         console.log(`loc: '${locationDropdownVal}'`);
    //     },
    //     [props.match]
    // )

    // Labels for form fields
    const labels = [
        "Date",
        "Time",
        "Home/Away/Neutral",
        "Location",
        ...((locationDropdownVal == MATCH_LOCATION_TYPE.NEW_LOCATION) ? [""] : []),
        "Opponent",
        "Goals For",
        "Goals Against",
        "Penalties?",
        ...(showPens ? ["Penalties For", "Penalties Against"] : []),
    ];

    const setLoc = (loc:string) => {
        updateMatch('location', loc);
        setLocationDropdownVal(loc);
    }

    if (!props.locations) {
        return <Loading/>
    }

    return (
        <div id="match-info-input">
            <div id="match-info-input-labels" className="match-info-input-div">
                {labels.map((lab) => (
                    <b className="match-info-input-row" key={generateId()}>
                        {lab}
                    </b>
                ))}
            </div>
            <div id="match-info-input-inputs" className="match-info-input-div">
                <div className="match-info-input-row">
                    <input
                        type="date"
                        value={props.match.date ?? ""}
                        onChange={(e) => updateMatch("date", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="time"
                        value={props.match.time ?? ""}
                        onChange={(e) => updateMatch("time", e.target.value)}
                    />
                </div>
                <div id='han-radios' className="match-info-input-row">
                    {
                        ['H','A','N'].map(
                            (han:string) => (
                                <div
                                    className="han-radio-div"
                                    key={generateId()}
                                >
                                    {han}
                                    <input
                                        type='radio'
                                        name='han'
                                        value={han}
                                        checked={props.match.home_away_neutral == han}
                                        onChange={() => updateMatch("home_away_neutral", han)}
                                    />
                                </div>
                            )
                        )
                    }
                </div>
                <div className="match-info-input-row">
                    <select
                        id='location-select'
                        // type="drop"
                        // value={props.match.location}
                        // onChange={(e) => updateMatch("location", e.target.value)}
                        value={locationDropdownVal}
                        onChange={(e) => setLoc(e.target.value)}
                        disabled={props.match.home_away_neutral == undefined}
                    >
                        {
                            [""]
                                .concat(props.locations[props.match.home_away_neutral] ?? [])
                                .concat([MATCH_LOCATION_TYPE.NEW_LOCATION]).map(
                                (loc:string) => (
                                    <option
                                        key={generateId()}
                                        value={loc}
                                        disabled={loc == ""}
                                    >
                                        {loc}
                                    </option>
                                )
                            )
                        }
                    </select>
                </div>
                {
                    (locationDropdownVal == MATCH_LOCATION_TYPE.NEW_LOCATION) && (
                        <div className="match-info-input-row">
                            <input
                                type="text"
                                value={props.match.location ?? ""}
                                onChange={(e) => updateMatch("location", e.target.value)}
                            />
                        </div>
                    )
                }
                <div className="match-info-input-row">
                    <input
                        type="text"
                        value={props.match.opposition_team_name ?? ""}
                        onChange={(e) => updateMatch("opposition_team_name", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <BasicNumberInput
                        value={props.match.goals_for}
                        setValue={(updater) => updateMatch("goals_for", updater)}
                    />
                </div>
                <div className="match-info-input-row">
                    <BasicNumberInput
                        value={props.match.goals_against}
                        setValue={(updater) => updateMatch("goals_against", updater)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="checkbox"
                        checked={showPens}
                        onChange={() => setShowPens((prev) => !prev)}
                    />
                </div>

                {showPens && (
                    <>
                        <div className="match-info-input-row">
                            <BasicNumberInput
                                value={props.match.pens_for ?? 0}
                                setValue={(updater) => updateMatch("pens_for", updater)}
                            />
                        </div>
                        <div className="match-info-input-row">
                            <BasicNumberInput
                                value={props.match.pens_against ?? 0}
                                setValue={(updater) => updateMatch("pens_against", updater)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
