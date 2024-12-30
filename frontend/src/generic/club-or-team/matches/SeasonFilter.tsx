import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Season } from "../../../types/Season";

interface OwnProps {
    selectedSeason:string
    setSelectedSeason:Function
    seasonOptions:Season[]
}

export const SeasonFilter = (props:OwnProps) => {

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        props.setSelectedSeason(event.target.value as string);
    }

    return (
        <div
            id="season-filter"
            className="match-filter"
        >
            <strong>Team</strong>
            <FormControl>
                <InputLabel id="demo-simple-select-label">
                    Team
                </InputLabel>
                <Select
                value={props.selectedSeason}
                onChange={handleSeasonSelect}
            >
                {
                    props.seasonOptions.map(
                        (season:Season) => {
                            return (
                                <MenuItem
                                    key={season.season_id}
                                    value={season.season_id}
                                >
                                    {season.season_name}
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