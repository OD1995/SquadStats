import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import { LeagueSeason } from "../../../types/Season";

interface OwnProps {
    selectedSeason:string
    setSelectedSeason:Function
    seasonOptions:LeagueSeason[]
}

export const SeasonFilter = (props:OwnProps) => {

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        props.setSelectedSeason(event.target.value as string);
    }

    const options = [
        {
            season_name: "",
            season_id: ""
        } as LeagueSeason
    ].concat(props.seasonOptions);

    return (
        <div
            id="season-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Season
            </strong>
            <FormControl>
                <Select
                    value={props.selectedSeason}
                    onChange={handleSeasonSelect}
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                    className="filter-select"
                >
                    {
                        options.map(
                            (season:LeagueSeason) => {
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