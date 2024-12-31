import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
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

    const options = [
        {
            season_name: "",
            season_id: ""
        } as Season
    ].concat(props.seasonOptions);

    return (
        <div
            id="season-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Season^
            </strong>
            <FormControl>
                {/* <InputLabel>
                    Season
                </InputLabel> */}
                <Select
                    value={props.selectedSeason}
                    onChange={handleSeasonSelect}
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                    className="filter-select"
                >
                    {
                        options.map(
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