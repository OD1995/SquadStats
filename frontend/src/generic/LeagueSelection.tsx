import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { League } from "../types/League"

interface OwnProps {
    leagues:League[]
    selectedLeague:string
    setSelectedLeague:Function
    flexDirection:'row'|'column'
}

export const LeagueSelection = (props:OwnProps) => {

    const handleLeagueSelect = (event:SelectChangeEvent) => {
        props.setSelectedLeague(event.target.value as string);
    }

    return (
        <div
            id='team-scrape-season-div'
            style={{
                flexDirection: props.flexDirection
            }}
        >
            <strong id='team-scrape-season-label'>
                League
            </strong>
            <FormControl>
                <Select
                    value={props.selectedLeague}
                    onChange={handleLeagueSelect}
                >
                    {
                        props.leagues.map(
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