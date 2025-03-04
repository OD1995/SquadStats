import { ChangeEvent, useEffect, useState } from "react";
import { BasicNumberInput } from "../../../../generic/BasicNumberInput";
import { Player } from "../../../../types/Player";

interface OwnProps {
    activePlayers:Record<string, Player>
    goals:Record<string, number>
    setGoals:Function
    potm:string
    setPotm:Function
    goalsFor:number
}

export const GoalsInput = (props:OwnProps) => {

    // const [rows, setRows] = useState<JSX.Element[]>([]);

    const updatePlayerGoals = (
        playerId:string,
        updater: ((prev: number) => number)// | number | string | null
    ) => {
        // props.setMatch((prevMatch) => ({
        //     ...prevMatch,
        //     [key]: typeof updater === "function"
        //         ? updater(prevMatch[key] as number ?? 0) // Ensure prev is always a number
        //         : updater,
        // }));
        props.setGoals(
            (prevGoals:Record<string, number>) => {
                // const gap = prevPgap[playerId] ?? {
                //     goals: null,
                //     potm: false
                // } as GoalsAndPotm;
                // gap.goals = updater(gap.goals ?? 0)
                return {
                    ...prevGoals,
                    [playerId]: updater(prevGoals[playerId] ?? 0)
                }
            }
        )
    };

    // const updatePlayerPotm = (playerId:string, newVal:boolean) => {
    //     props.setPlayerGoalsAndPotms(
    //         (prevPgap:Record<string, GoalsAndPotm>) => {
    //             const gap = prevPgap[playerId] ?? {
    //                 goals: null,
    //                 potm: false
    //             } as GoalsAndPotm;
    //             gap.potm = newVal;
    //             return {
    //                 ...prevPgap,
    //                 [playerId]: gap
    //             }
    //         }
    //     )
    // }

    const handlePotmChange = (playerId:string, isChecked:boolean) => {
        if (isChecked) {
            props.setPotm(playerId);
        }
    }

    const getPlayerNameDiv = (player:Player) => {
        const playerName = player.better_player_name ?? player.player_name;
        var val = 1;
        const max_chars = 16
        if (playerName.length > max_chars) {
            val -= (playerName.length - max_chars) * 0.0455
        }
        val = Math.min(val, 2);
        const fontWeightVal = playerName == ownGoal ? "bold" : "normal";
        const fontStyleVal = playerName == ownGoal ? "italic" : "normal";
        return (
            <div
                className="gi-name"
                style={{
                    fontSize: `${val}rem`,
                    fontWeight: fontWeightVal,
                    fontStyle: fontStyleVal
                }}
            >
                {playerName}
            </div>
        )
    }

    const ownGoal = 'OWN GOALS';

    const getRows = () => {
        var rows = [];
        var goalsLeftToAssign = props.goalsFor;
        for (const playerId of Object.keys(props.activePlayers).concat([ownGoal])) {
            var player = null;
            var goalsVal = null;
            var potmInput = null;
            if (playerId == ownGoal) {
                player = {
                    player_id: ownGoal,
                    player_name: ownGoal
                } as Player;
                goalsVal = goalsLeftToAssign;
            } else {
                player = props.activePlayers[playerId];
                // if ((props.playerGoalsAndPotms) && (props.playerGoalsAndPotms[playerId])) {
                // if (props.goals[playerId])
                // }
                goalsVal = Math.min(props.goals[playerId] ?? 0, goalsLeftToAssign);
                goalsLeftToAssign -= goalsVal;
                potmInput = (
                    <input
                        type='radio'
                        name='potm'
                        value={playerId}
                        checked={props.potm == playerId}
                        onChange={(e:ChangeEvent<HTMLInputElement>) => handlePotmChange(playerId, e.target.checked)}
                    />
                )
            }
            rows.push(
                <div
                    key={playerId}
                    className="gi-row"
                >
                    {getPlayerNameDiv(player)}
                    <BasicNumberInput
                        className='gi-goals'
                        value={goalsVal}
                        setValue={(updater) => updatePlayerGoals(playerId, updater)}
                    />
                    <div
                        className="gi-potm"
                    >
                        {potmInput}
                    </div>
                </div>
            )
        }
        return rows;
    }

    // useEffect(
    //     () => {
    //         setRows(getRows())
    //     },
    //     [props.playerGoalsAndPotms]
    // )

    return (
        <div id='goals-input'>
            <div id='goals-scored-text'>
                Goals Scored: {props.goalsFor}
            </div>
            <div className="gi-row">
                <div className="gi-name">                    
                </div>
                <div className="gi-goals">
                    <b>Goals</b>
                </div>
                <div className="gi-potm">
                    <b>POTM?</b>
                </div>
            </div>
            {/* {rows} */}
            {getRows()}
        </div>
    );
}