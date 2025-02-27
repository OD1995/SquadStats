import { Player } from "../../../../types/Player";

interface OwnProps {
    availablePlayers?:Player[]
    setAvailablePlayers:Function
    activePlayers:Player[]
    setActivePlayers:Function
}

export const PlayerSelection = (props:OwnProps) => {
    return (
        <div id='player-selection-section'>
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
    );
}