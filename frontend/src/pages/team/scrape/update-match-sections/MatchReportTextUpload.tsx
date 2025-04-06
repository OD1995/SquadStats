import { ChangeEvent } from "react";
import { Match } from "../../../../types/Match";

interface OwnProps {
    match:Match
    setMatch:Function
}

export const MatchReportTextUpload = (props:OwnProps) => {

    const handleTextInput = (event:ChangeEvent<HTMLTextAreaElement>) => {
        props.setMatch(
            (oldMatch:Match) => ({
                ...oldMatch,
                match_report_text: event.target.value
            })
        )
    }

    return (
        <div>
            <textarea
                // type="text"
                placeholder="Match report text"
                id='match-report-text-input'
                className="input-padder"
                value={props.match.match_report_text ?? ""}
                onChange={handleTextInput}
            />
        </div>
    );
}