import React, { useState, useEffect } from "react";
import { Match } from "../../../../types/Match";
import { generateId } from "../../../../helpers/other";
import { BasicNumberInput } from "../../../../generic/BasicNumberInput";

interface OwnProps {
    match: Match;
    setMatch: (updater: (prevVal: Match) => Match) => void;
}

export const MatchInfoInput: React.FC<OwnProps> = ({ match, setMatch }) => {
    const [showPens, setShowPens] = useState<boolean>(false);

    // Function to update match properties (supports function updaters)
    const updateMatch = (
        key: keyof Match,
        updater: ((prev: number) => number) | number | string | null
    ) => {
        setMatch((prevMatch) => ({
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

    // Labels for form fields
    const labels = [
        "Date",
        "Time",
        "Location",
        "Opponent",
        "Goals For",
        "Goals Against",
        "Penalties?",
        ...(showPens ? ["Penalties For", "Penalties Against"] : []),
    ];

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
                        value={match.date}
                        onChange={(e) => updateMatch("date", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="time"
                        value={match.time}
                        onChange={(e) => updateMatch("time", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="text"
                        value={match.location}
                        onChange={(e) => updateMatch("location", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <input
                        type="text"
                        value={match.opposition_team_name}
                        onChange={(e) => updateMatch("opposition_team_name", e.target.value)}
                    />
                </div>
                <div className="match-info-input-row">
                    <BasicNumberInput
                        value={match.goals_for}
                        setValue={(updater) => updateMatch("goals_for", updater)}
                    />
                </div>
                <div className="match-info-input-row">
                    <BasicNumberInput
                        value={match.goals_against}
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
                                value={match.pens_for ?? 0}
                                setValue={(updater) => updateMatch("pens_for", updater)}
                            />
                        </div>
                        <div className="match-info-input-row">
                            <BasicNumberInput
                                value={match.pens_against ?? 0}
                                setValue={(updater) => updateMatch("pens_against", updater)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
