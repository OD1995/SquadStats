import { GenericTableData } from "./GenericTableTypes";
import { Match } from "./Match";
import { Team } from "./Team";

export interface MatchData {
    match_info:Match
    // player_data:Record<string,Record<string,string>>
    player_data:GenericTableData
    team_name:string
    competition_full_name:string
    unique_metric_names:string[]
    team:Team
    league_season_id:string
}