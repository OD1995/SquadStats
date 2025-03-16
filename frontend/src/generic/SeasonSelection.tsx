import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { LeagueSeason } from "../types/Season"

interface OwnProps {
    seasons:LeagueSeason[]
    selectedSeason:string
    setSelectedSeason:Function
    flexDirection:'row'|'column'
    justifyContent?:string
}

export const SeasonSelection = (props:OwnProps) => {

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        props.setSelectedSeason(event.target.value as string);
    }

    return (
        <div
            id='team-scrape-season-div'
            style={{
                flexDirection: props.flexDirection,
                justifyContent: props.justifyContent
            }}
        >
            <strong id='team-scrape-season-label'>
                Season
            </strong>
            <FormControl>
                <Select
                    className="filter-select"
                    value={props.selectedSeason}
                    onChange={handleSeasonSelect}
                >
                    {
                        props.seasons.map(
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
    )
}