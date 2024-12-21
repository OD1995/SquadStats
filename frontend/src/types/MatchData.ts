import { Match } from "./Match";

export interface MatchData {
    match_info:Match
    player_data:Record<string,Record<string,string>>
    team_name:string
    competition_full_name:string
    unique_metric_names:string[]
}