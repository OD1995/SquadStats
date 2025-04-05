import { minAppsRelevant } from "../../../helpers/other";
import { isWiderThanHigher } from "../../../helpers/windowDimensions";
import { Club } from "../../../types/Club";
import { SPLIT_BY_TYPE } from "../../../types/enums";
import { GenericOption } from "../../../types/GenericOption";
import { Player } from "../../../types/Player";
import { LeagueSeason } from "../../../types/Season";
import { Team } from "../../../types/Team";
import { TeamFilter } from "../matches/TeamFilter";
import { MinAppsFilter } from "../players/MinAppsFilter";
import { GenericDropdownFilter } from "./GenericDropdownFilter";

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
    yearOptions:string[]
    selectedYear:string
    setSelectedYear:Function
    monthOptions:string[]
    selectedMonth:string
    setSelectedMonth:Function
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

    const stringMapper = (option:string) => {
        return {
            label: option,
            value: option
        } as GenericOption
    }
    
    return (
        <div id={(isDesktop ? "desktop" : "mobile") + '-mop-fop-parent'}> 
            <h4
                id={(isDesktop ? "desktop" : "mobile") + '-optional-filters-subtitle'}
                className="small-caps-subtitle"
            >
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
                <GenericDropdownFilter
                    title='Season'
                    selectedOption={props.selectedSeason}
                    setSelectedOption={props.setSelectedSeason}
                    options={getSeasons().map(
                        (leagueSeason:LeagueSeason) => (
                            {
                                label: leagueSeason.season_name,
                                value: leagueSeason.season_id
                            } as GenericOption
                        )
                    )}
                />
                {
                    props.matches && (
                        <GenericDropdownFilter
                            title="Player"
                            options={props.playerFilterOptions.map(
                                (player:Player) => (
                                    {
                                        value:player.player_id,
                                        label:player.better_player_name ?? player.player_name
                                    } as GenericOption
                                ))
                            }
                            setSelectedOption={props.setPlayerIdFilter}
                            selectedOption={props.playerIdFilter}
                        />
                    )
                }
                {
                    ((props.selectedSplitBy == SPLIT_BY_TYPE.OPPOSITION) || (props.players)) && (
                        <GenericDropdownFilter
                            title="Opposition"
                            selectedOption={props.selectedOpposition}
                            setSelectedOption={props.setSelectedOpposition}
                            options={props.oppositionOptions.map(stringMapper)}
                        />
                    )
                }
                {
                    minAppsRelevant(props.perGame, props.metric) && (
                        <MinAppsFilter
                            minApps={props.minApps}
                            setMinApps={props.setMinApps}
                        />
                    )
                }
                <GenericDropdownFilter
                    title='Year'
                    selectedOption={props.selectedYear}
                    options={props.yearOptions.map(stringMapper)}
                    setSelectedOption={props.setSelectedYear}
                />
                <GenericDropdownFilter
                    title='Month'
                    selectedOption={props.selectedMonth}
                    options={props.monthOptions.map(stringMapper)}
                    setSelectedOption={props.setSelectedMonth}
                />
            </div>
        </div>
    );
}