import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { Season } from "../types/Season"

interface OwnProps {
    seasons:Season[]
    selectedSeason:string
    setSelectedSeason:Function
    flexDirection:'row'|'column'
}

export const SeasonSelection = (props:OwnProps) => {

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        props.setSelectedSeason(event.target.value as string);
    }

    return (
        <div
            id='team-scrape-season-div'
            style={{
                flexDirection: props.flexDirection
            }}
        >
            <strong id='team-scrape-season-label'>
                Season
            </strong>
            <FormControl>
                <Select
                    value={props.selectedSeason}
                    onChange={handleSeasonSelect}
                >
                    {
                        props.seasons.map(
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
    )
}