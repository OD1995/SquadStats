import { MatchError } from "./MatchError";

export interface Match {
    match_id:string,
    data_source_match_id: string,
    competition_acronym: string,
    goals_for: number,
    goals_against: number,
    goal_difference: number,
    pens_for: string,
    pens_against: string,
    opposition_team_name: string,
    result: string,
    date: string,
    time: string,
    location: string,
    home_away_neutral: string,
    match_errors:MatchError[]
}