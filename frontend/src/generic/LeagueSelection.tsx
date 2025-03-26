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

    const getLeagueMatchCount = (lg:League) => {
        var matchCount = 0;
        for (const lgSsn of Object.values(lg.league_seasons)) {
            matchCount += lgSsn.team_season.matches.length
        }
        return matchCount;
    }

    return (
        <div
            className='team-scrape-season-div'
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
                        Object.values(props.leagues).filter(
                            (league:League) => getLeagueMatchCount(league) > 0
                        ).map(
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