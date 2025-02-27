import { SubtitleAndButtons } from "./SubtitleAndButtons";
import "./UpdateMatch.css"

export const PlayerSelection = () => {
    return (
        <div>
            <SubtitleAndButtons
                subtitle='Player Selection'
                forwardText="Goals + POTM"
            />
            <div id='selection-section'>
                <div
                    id='all-players-div'
                    className="players-div"
                >

                </div>                
                <div
                    id='active-players-div'
                    className="players-div"
                >

                </div>
            </div>
        </div>
    );
}