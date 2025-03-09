import { useState } from "react";
import { generateId } from "../../../../helpers/other";
import { PLAYER_LIST_TYPE } from "../../../../types/enums";
import { Player } from "../../../../types/Player";
import { Modal } from "../../../../generic/Modal";
import { ButtonDiv } from "../../../../generic/ButtonDiv";

interface OwnProps {
    subsubtitle:PLAYER_LIST_TYPE
    players:Record<string, Player>
    updatePlayerLists:Function
    addNewPlayer?:Function
}

export const MatchPlayerList = (props:OwnProps) => {

    const [showModal, setShowModal] = useState<boolean>(false);
    const [newPlayerName, setNewPlayerName] = useState<string>("");

    const getPlayerNameDiv = (player:Player) => {
        const playerName = player.better_player_name ?? player.player_name;
        var val = 1;
        const max_chars = 16
        if (playerName.length > max_chars) {
            val -= (playerName.length - max_chars) * 0.0455
        }
        val = Math.min(val, 2);
        return (
            <div
                style={{fontSize: `${val}rem`}}
            >
                {playerName}
            </div>
        )
    }

    const createButton = (player:Player) => {
        const isAdd = props.subsubtitle == PLAYER_LIST_TYPE.ALL_PLAYERS;
        const onClickFunc = () => props.updatePlayerLists(player.player_id, isAdd);
        const sign = isAdd ? "+" : "-";
        const classNameStr = isAdd ? "ss-green-button" : "ss-red-button";
        return (
            <button
                key={generateId()}
                className={"mpl-button " + classNameStr}
                onClick={onClickFunc}
            >
                {sign}
            </button>
        )
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const handleNewPlayerSubmit = () => {
        if (props.addNewPlayer) {
            props.addNewPlayer(newPlayerName);
            setShowModal(false);
            setNewPlayerName("");
        }
    }

    const modalContent = (
        <div id='new-player-modal'>
            <div>
                <b>
                    New Player Name
                </b>
                <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                />
            </div>
            <ButtonDiv
                buttonText="Submit"
                onClickFunction={handleNewPlayerSubmit}
            />
        </div>
    );

    return (
        <div className="match-player-list">
            {
                showModal && (
                    <Modal
                        content={modalContent}
                        handleModalClose={handleModalClose}
                    />
                )
            }
            <h1 className="small-caps-subtitle">
                {props.subsubtitle.toUpperCase()}
            </h1>
            <div className="player-list">
                {
                    Object.values(props.players).map(
                        (player:Player) => (
                            <div
                                key={generateId()}
                                className="mpl-row"
                            >
                                {createButton(player)}
                                {getPlayerNameDiv(player)}
                            </div>   
                        )
                    )
                }
            </div>
            <div className="mpl-below-players">
                {
                    (props.subsubtitle == PLAYER_LIST_TYPE.ACTIVE_PLAYERS) ? (
                        <b>
                            Player Count: {Object.values(props.players).length}
                        </b>
                    ) : (
                        <a onClick={() => setShowModal(true)}>
                            Add New Player
                        </a>
                    )
                }
            </div>
        </div>
    );
}