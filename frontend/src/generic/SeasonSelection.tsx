import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { LeagueSeason } from "../types/Season"

interface OwnProps {
    seasons:LeagueSeason[]
    selectedSeason:string
    setSelectedSeason:Function
    flexDirection:'row'|'column'
    justifyContent?:string
    teamScrape?:boolean
    showAllSeasons?:boolean
}

export const SeasonSelection = (props:OwnProps) => {

    const handleSeasonSelect = (event:SelectChangeEvent) => {
        props.setSelectedSeason(event.target.value as string);
    }

    const getStyles = () => {
        var s = {} as Record<string, string>;
        s['flexDirection'] = props.flexDirection;
        if (props.justifyContent) {
            s['justifyContent'] = props.justifyContent;
        }
        // if (props.teamScrape) {
        //     s['width'] = "20vw";
        // }
        // style={{
        //     flexDirection: props.flexDirection,
        //     justifyContent: props.justifyContent
        // }}
        return s;
    }

    return (
        <div
            className='team-scrape-season-div'
            // style={{
            //     flexDirection: props.flexDirection,
            //     justifyContent: props.justifyContent
            // }}
            style={getStyles()}
        >
            <strong id='team-scrape-season-label'>
                Season
            </strong>
            <FormControl>
                <Select
                    className={props.teamScrape ? "" : "filter-select"}
                    value={props.selectedSeason}
                    onChange={handleSeasonSelect}
                >
                    {
                        props.seasons.filter(
                            (lgSsn:LeagueSeason) => (
                                (props.teamScrape || props.showAllSeasons) ? 
                                    true : lgSsn.team_season.matches.length > 0
                            )
                        ).sort(
                            (a:LeagueSeason, b:LeagueSeason) => a.season_name.localeCompare(b.season_name)
                        ).map(
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