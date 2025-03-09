import { UPDATE_MATCH_SECTIONS } from "../../../../types/enums"
import { Match } from "../../../../types/Match"

interface OwnProps {
    subtitle:string
    backText:string|null
    forwardText:string|null
    setSectionIndex:Function
    match:Match
    setErrorMessage:Function
    potm:string
    saveMatch:Function
    newCompName:string
    newCompAcronym:string
}

export const SubtitleAndButtons = (props:OwnProps) => {

    const validateAndMoveForward = () => {
        var advance = true;
        if (props.subtitle == UPDATE_MATCH_SECTIONS.MATCH_INFO) {
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
            if (!props.match.competition_id) {
                if (props.newCompName == "") {
                    problems.push('New Competition Name')
                }
                if (props.newCompAcronym == "") {
                    problems.push("New Competition Acronym/Shortening")
                }
            }
            if (problems.length > 0) {
                const txt = "Set the following values before moving on " + problems.join(", ");
                props.setErrorMessage(txt);
                advance = false;
            } 
        } else if (props.subtitle == UPDATE_MATCH_SECTIONS.GOALS_AND_POTM) {
            if (props.potm == "") {
                const txt = "Set a POTM before saving";
                props.setErrorMessage(txt);
                advance = false;
            }
        }
        if (advance) {
            props.setErrorMessage("");
            if (props.forwardText === null) {
                props.saveMatch();
            } else {
                props.setSectionIndex((prevVal:number) => prevVal + 1);
            }
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
                        onClick={validateAndMoveForward}
                    >
                        Save
                    </button>
                )
            }
        </div>
    );
}