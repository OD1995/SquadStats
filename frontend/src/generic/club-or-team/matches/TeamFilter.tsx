import { FormControl, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material"
import { Club } from "../../../types/Club"
import { Team } from "../../../types/Team"
import { LeagueSeason } from "../../../types/Season"

interface OwnProps {
    club:Club
    selectedTeamId:string
    setSelectedTeamId:Function
    clubSeasons:Record<string, LeagueSeason[]>
    setTeamSeasons:Function
}

export const TeamFilter = (props:OwnProps) => {
    
    const handleTeamSelect = (event:SelectChangeEvent) => {
        const newTeamId = event.target.value as string;
        props.setSelectedTeamId(newTeamId);
        props.setTeamSeasons(props.clubSeasons[newTeamId]);
    }

    const options = [
        {
            team_id: '',
            team_name: ''
        } as Team
    ].concat(props.club.teams)

    return (
        <div
            id="team-filter"
            className="match-filter"
        >
            <strong className="filter-select-title">
                Team
            </strong>
            <FormControl>
                {/* <InputLabel>
                    Team
                </InputLabel> */}
                <Select
                    value={props.selectedTeamId}
                    onChange={handleTeamSelect}
                    // label='Team'
                    input={<OutlinedInput sx={{fontSize: '0.8rem'}} />}
                    className="filter-select"
                >
                    {
                        options.map(
                            (team:Team) => {
                                return (
                                    <MenuItem
                                        key={team.team_id}
                                        value={team.team_id}
                                    >
                                        {team.team_name}
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