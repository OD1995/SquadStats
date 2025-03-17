import { PLAYER_LIST_TYPE } from "../../../../types/enums";
import { Player } from "../../../../types/Player";
import { MatchPlayerList } from "./MatchPlayerList";
import { v4 as uuidv4 } from "uuid";
import { PlayerOrderingToggle } from "./PlayerOrderingToggle";

interface OwnProps {
    availablePlayers:Record<string, Player>
    setAvailablePlayers:Function
    activePlayers:Record<string, Player>
    setActivePlayers:Function
}

export const PlayerSelection = (props:OwnProps) => {

    const updatePlayerLists = (playerId:string, isAdd:boolean) => {
        const playerToMove = (isAdd ? props.availablePlayers : props.activePlayers)[playerId] as Player;
        const takeFromSetter = isAdd ? props.setAvailablePlayers : props.setActivePlayers;
        const addToSetter = isAdd ? props.setActivePlayers : props.setAvailablePlayers;
        takeFromSetter(
            (prevItems:Record<string,Player>) => {
                const { [playerId]:_, ...newItems} = prevItems;
                return newItems;
            }
        );
        addToSetter(
            (prevItems:Record<string, Player>) => (
                {
                    ...prevItems,
                    [playerId]: playerToMove
                }
            )
        );

    }

    const addNewPlayer = (newPlayerName:string) => {
        const newPlayer = {
            player_id: uuidv4(),
            player_name: newPlayerName
        } as Player;
        props.setAvailablePlayers(
            (prevItems:Record<string,Player>) => (
                {
                    ...prevItems,
                    [newPlayer.player_id]: newPlayer
                }
            )
        );
    }

    return (
        <div id='player-selection-parent'>
            <PlayerOrderingToggle/>
            <div id='player-selection'>
                <MatchPlayerList
                    subsubtitle={PLAYER_LIST_TYPE.ALL_PLAYERS}
                    players={props.availablePlayers}
                    updatePlayerLists={updatePlayerLists}
                    addNewPlayer={addNewPlayer}
                />
                <MatchPlayerList
                    subsubtitle={PLAYER_LIST_TYPE.ACTIVE_PLAYERS}
                    players={props.activePlayers}
                    updatePlayerLists={updatePlayerLists}
                />
            </div>
        </div>
    );
}