import { Match } from "../../../../types/Match"

interface OwnProps {
    subtitle:string
    backText:string|null
    forwardText:string|null
    setSectionIndex:Function
    match:Match
    setErrorMessage:Function
}

export const SubtitleAndButtons = (props:OwnProps) => {

    const validateAndMoveForward = () => {
        const properties = {
            "date": "Date",
            "time": "Time",
            "home_away_neutral": "Home/Away/Neutral",
            "location": "Location",
            "opposition_team_name": "Opponent",
            "goals_for": "Goals For",
            "goals_against": "Goals Against",
        } as Record<string, string>;
        var problems = []
        for (const prop of Object.keys(properties)) {
            const val = props.match[prop as keyof Match];
            if ((val == null) || (val == undefined) || (val === "")) {
                problems.push(properties[prop]);
            }
        }
        if (problems.length > 0) {
            const txt = "Set the following values before moving on " + problems.join(", ");
            props.setErrorMessage(txt);
        } else {
            props.setErrorMessage("");
            props.setSectionIndex((prevVal:number) => prevVal + 1)
        }
    }

    return (
        <div id='subtitle-and-buttons-div'>
            {
                (props.backText) ? (
                    <button
                        className="sab-button-text ss-red-button"
                        onClick={() => props.setSectionIndex((prevVal:number) => prevVal - 1)}
                    >
                        {"<< " + props.backText}
                    </button>
                ) : (
                    <button
                        className="sab-button-text empty-button"
                        disabled={true}
                    >
                        .
                    </button>
                )
            }
            <b
                className="sab-subtitle-text"
            >
                {props.subtitle}
            </b>
            {
                (props.forwardText) ? (
                    <button
                        className="sab-button-text ss-green-button"
                        onClick={validateAndMoveForward}
                    >
                        {props.forwardText + " >>"}
                    </button>
                ) : (
                    <button
                        className="sab-button-text ss-green-button"
                        disabled={true}
                    >
                        Save
                    </button>
                )
            }
        </div>
    );
}