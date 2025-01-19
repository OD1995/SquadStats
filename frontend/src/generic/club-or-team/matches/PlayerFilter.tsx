import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { Player } from "../../../types/Player";

interface OwnProps {
    playerIdFilter:string
    setPlayerIdFilter:Function
    playerFilterOptions:Player[]
}

export const PlayerFilter = (props:OwnProps) => {

    const handleSelect = (event:SelectChangeEvent) => {
        props.setPlayerIdFilter(event.target.value as string);
    }

    const options = [
        {
            player_id: "",
            player_name: ""
        } as Player
    ].concat(props.playerFilterOptions);

    return (
        <div
            id="player-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Player
            </strong>
            <FormControl>
                <Select
                    value={props.playerIdFilter}
                    onChange={handleSelect}
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                    className="filter-select"
                >
                    {
                        options.map(
                            (player:Player) => {
                                return (
                                    <MenuItem
                                        key={player.player_id}
                                        value={player.player_id}
                                    >
                                        {player.player_name}
                                    </MenuItem>
                                )
                            }
                        )
                    }
                </Select>
            </FormControl>
        </div>
    );
}