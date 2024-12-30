import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { Club } from "../../../types/Club"
import { Team } from "../../../types/Team"

interface OwnProps {
    club:Club
    selectedTeamId:string
    setSelectedTeamId:Function
}

export const TeamFilter = (props:OwnProps) => {
    
    const handleTeamSelect = () => {
        props.setSelectedTeamId()
    }

    return (
        <div
            id="team-filter"
            className="match-filter"
        >
            <strong>Team</strong>
            <FormControl>
                <InputLabel id="demo-simple-select-label">
                    Team
                </InputLabel>
                <Select
                    value={props.selectedTeamId}
                    onChange={handleTeamSelect}
                    label='Team'
                >
                    {
                        props.club.teams.map(
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