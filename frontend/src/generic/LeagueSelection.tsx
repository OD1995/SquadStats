import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { League } from "../types/League"

interface OwnProps {
    leagues:Record<string, League>
    selectedLeague:string
    setSelectedLeague:Function
    flexDirection:'row'|'column'
    justifyContent?:string
}

export const LeagueSelection = (props:OwnProps) => {

    const handleLeagueSelect = (event:SelectChangeEvent) => {
        props.setSelectedLeague(event.target.value as string);
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
                League
            </strong>
            <FormControl>
                <Select
                    className="filter-select"
                    value={props.selectedLeague}
                    onChange={handleLeagueSelect}
                >
                    {
                        Object.values(props.leagues).map(
                            (league:League) => {
                                return (
                                    <MenuItem
                                        key={league.league_id}
                                        value={league.league_id}
                                    >
                                        {league.league_name}
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