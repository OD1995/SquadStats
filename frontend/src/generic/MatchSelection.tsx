import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { League } from "../types/League"
import { Match } from "../types/Match"

interface OwnProps {
    matches:Match[]
    selectedMatch:string
    setSelectedMatch:Function
    flexDirection:'row'|'column'
    justifyContent?:string
}

export const MatchSelection = (props:OwnProps) => {

    const handleMatchSelect = (event:SelectChangeEvent) => {
        props.setSelectedMatch(event.target.value as string);
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
                Match
            </strong>
            <FormControl>
                <Select
                    className="filter-select"
                    value={props.selectedMatch}
                    onChange={handleMatchSelect}
                >
                    {
                        props.matches.map(
                            (match:Match) => {
                                const matchName = `${match.opposition_team_name} (${match.home_away_neutral}) ${match.date}`;
                                return (
                                    <MenuItem
                                        key={match.match_id}
                                        value={match.match_id}
                                    >
                                        {matchName}
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