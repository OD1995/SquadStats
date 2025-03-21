import { PLAYER_LIST_TYPE } from "../../../../types/enums";
import { Player, SortablePlayer } from "../../../../types/Player";
import { MatchPlayerList } from "./MatchPlayerList";
import { v4 as uuidv4 } from "uuid";
import { PlayerOrderingToggle } from "./PlayerOrderingToggle";
import { useEffect, useState } from "react";

interface OwnProps {
    availablePlayers:Record<string,SortablePlayer>
    setAvailablePlayers:Function
    activePlayers:Record<string,SortablePlayer>
    setActivePlayers:Function
}

export const PlayerSelection = (props:OwnProps) => {

    // const [orderPlayersBy, setOrderPlayersBy] = useState<string>("name");
    const [isAlphabetical, setIsAlphabetical] = useState<boolean>(false);
    const [orderedActivePlayers, setOrderedActivePlayers] = useState<Player[]>([]);
    const [orderedAvailablePlayers, setOrderedAvailablePlayers] = useState<Player[]>([]);

    useEffect(
        () => {
            setOrderedActivePlayers(reOrderPlayers(props.activePlayers));
            setOrderedAvailablePlayers(reOrderPlayers(props.availablePlayers));
        },
        [isAlphabetical, props.availablePlayers, props.activePlayers]
    )

    const reOrderPlayers = (sortablePlayers:Record<string,SortablePlayer>) => {
        return Object.values(sortablePlayers).sort(playerSorter).map(
            (sp:SortablePlayer) => sp.player
        )
        // const a = Object.values(sortablePlayers).sort(playerSorter);
        // const b = a.map((sp:SortablePlayer) => sp.player);
        // return b;
        // for (const sortablePlayer of Object.values(players).sort(playerSorter)) {
        //     newPlayers[sortablePlayer.player.player_id] = sortablePlayer;
        // }
        // return players.sort(playerSorter);
    }

    const playerSorter = (playerA:SortablePlayer, playerB:SortablePlayer) => {
        if (isAlphabetical) {
            return alphabeticalSorter(playerA, playerB);
        } else {
            if (playerA.apps > playerB.apps) {
                return -1;
            } else if (playerA.apps < playerB.apps) {
                return 1;
            } else {
                return alphabeticalSorter(playerA, playerB)
            }
        }
    }

    const alphabeticalSorter = (playerA:SortablePlayer, playerB:SortablePlayer) => {
        // if (playerA.name)
        return playerA.name.toLowerCase().localeCompare(playerB.name.toLowerCase())
    }

    const updatePlayerLists = (playerId:string, isAdd:boolean) => {
        const playerToMove = (isAdd ? props.availablePlayers : props.activePlayers)[playerId] as SortablePlayer;
        const takeFromSetter = isAdd ? props.setAvailablePlayers : props.setActivePlayers;
        const addToSetter = isAdd ? props.setActivePlayers : props.setAvailablePlayers;
        takeFromSetter(
            (prevItems:Record<string,SortablePlayer>) => {
                const { [playerId]:_, ...newItems} = prevItems;
                return newItems;
            }
        );
        addToSetter(
            (prevItems:Record<string,SortablePlayer>) => (
                {
                    ...prevItems,
                    [playerId]: playerToMove
                }
            )
        );
    }

    const addNewPlayer = (newPlayerName:string) => {
        const newSortablePlayer = {
            player: {
                player_id: uuidv4(),
                player_name: newPlayerName
            } as Player,
            name: newPlayerName,
            apps: 0
        } as SortablePlayer;
        props.setAvailablePlayers(
            (prevItems:Record<string,SortablePlayer>) => (
                {
                    ...prevItems,
                    [newSortablePlayer.player.player_id]: newSortablePlayer
                }
            )
        );
    }

    return (
        <div id='player-selection-parent'>
            <PlayerOrderingToggle
                isAlphabetical={isAlphabetical}
                setIsAlphabetical={setIsAlphabetical}
            />
            <div id='player-selection'>
                <MatchPlayerList
                    subsubtitle={PLAYER_LIST_TYPE.ALL_PLAYERS}
                    players={orderedAvailablePlayers}
                    updatePlayerLists={updatePlayerLists}
                    addNewPlayer={addNewPlayer}
                />
                <MatchPlayerList
                    subsubtitle={PLAYER_LIST_TYPE.ACTIVE_PLAYERS}
                    players={orderedActivePlayers}
                    updatePlayerLists={updatePlayerLists}
                />
            </div>
        </div>
    );
}