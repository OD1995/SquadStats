import { Club } from "../../../types/Club";
import { QueryType } from "../../../types/enums";
import { Season } from "../../../types/Season";
import { Team } from "../../../types/Team";
import { OppositionFilter } from "../matches/OppositionFilter";
import { SeasonFilter } from "../matches/SeasonFilter";
import { TeamFilter } from "../matches/TeamFilter";

interface OwnProps {
    club?:Club
    team?:Team
    selectedTeamId:string
    clubSeasons:Record<string,Season[]>
    setSelectedTeamId:Function
    setTeamSeasons:Function
    selectedSeason:string
    setSelectedSeason:Function
    teamSeasons:Season[]
    selectedType:string
    selectedOpposition:string
    setSelectedOpposition:Function
    oppositionOptions:string[]
}

export const MatchesOrPlayersFilterOptional = (props:OwnProps) => {
    
    const getSeasons = () => {
        if (props.team) {
            return props.teamSeasons;
        }
        if (props.clubSeasons && (props.selectedTeamId != "")) {
            return props.clubSeasons[props.selectedTeamId]
        }
        return []
    }
    
    return (
        <div> 
            <h4 className="small-caps-subtitle">
                OPTIONAL
            </h4>           
            {
                props.club && (
                    <TeamFilter
                        club={props.club}
                        selectedTeamId={props.selectedTeamId}
                        setSelectedTeamId={props.setSelectedTeamId}
                        clubSeasons={props.clubSeasons!}
                        setTeamSeasons={props.setTeamSeasons}
                    />
                )
            }
            <SeasonFilter
                selectedSeason={props.selectedSeason}
                setSelectedSeason={props.setSelectedSeason}
                seasonOptions={getSeasons()}
            />
            
            {
                (props.selectedType == QueryType.H2H) && (
                    <OppositionFilter
                        selectedOpposition={props.selectedOpposition}
                        setSelectedOpposition={props.setSelectedOpposition}
                        oppositionOptions={props.oppositionOptions}
                    />
                )
            }
        </div>
    );
}