import { minAppsRelevant } from "../../../helpers/other";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Club } from "../../../types/Club";
import { METRIC, SPLIT_BY_TYPE } from "../../../types/enums";
import { Player } from "../../../types/Player";
import { LeagueSeason } from "../../../types/Season";
import { Team } from "../../../types/Team";
import { OppositionFilter } from "../matches/OppositionFilter";
import { PlayerFilter } from "../matches/PlayerFilter";
import { SeasonFilter } from "../matches/SeasonFilter";
import { TeamFilter } from "../matches/TeamFilter";
import { MinAppsFilter } from "../players/MinAppsFilter";

interface OwnProps {
    club?:Club
    team?:Team
    players?:boolean
    matches?:boolean
    clubSeasons:Record<string,LeagueSeason[]>
    selectedTeamId:string
    setSelectedTeamId:Function
    setTeamSeasons:Function
    selectedSeason:string
    setSelectedSeason:Function
    teamSeasons:LeagueSeason[]
    selectedSplitBy:string
    selectedOpposition:string
    setSelectedOpposition:Function
    oppositionOptions:string[]
    perGame?:boolean
    minApps:number
    setMinApps:Function
    playerIdFilter:string
    setPlayerIdFilter:Function
    playerFilterOptions:Player[]
    metric?:string
}

export const MatchesOrPlayersFilterOptional = (props:OwnProps) => {

    const isDesktop = isWiderThanHigher();
    
    const getSeasons = () => {
        if (props.team) {
            return props.teamSeasons;
        }
        if (props.club && props.clubSeasons) {
            return props.clubSeasons[props.selectedTeamId];
        }
        return []
    }
    
    return (
        <div id={(isDesktop ? "desktop" : "mobile") + '-mop-fop-parent'}> 
            <h4 className="small-caps-subtitle">
                OPTIONAL FILTERS
            </h4>
            <div id={(isDesktop ? "desktop" : "mobile") + '-mop-fop-filters'}>
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
                    props.matches && (
                        <PlayerFilter
                            playerIdFilter={props.playerIdFilter}
                            setPlayerIdFilter={props.setPlayerIdFilter}
                            playerFilterOptions={props.playerFilterOptions}
                        />
                    )
                }
                {
                    (props.selectedSplitBy == SPLIT_BY_TYPE.OPPOSITION) && (
                        <OppositionFilter
                            selectedOpposition={props.selectedOpposition}
                            setSelectedOpposition={props.setSelectedOpposition}
                            oppositionOptions={props.oppositionOptions}
                        />
                    )
                }
                {
                    // (props.perGame || (props.metric && (minAppsMetrics.includes(props.metric)))) && (
                    minAppsRelevant(props.perGame, props.metric) && (
                        <MinAppsFilter
                            minApps={props.minApps}
                            setMinApps={props.setMinApps}
                        />
                    )
                }
            </div>
        </div>
    );
}