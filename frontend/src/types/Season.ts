import { Match } from "./Match"

export interface LeagueSeason {
    season_name:string
    season_id:string
    team_season:TeamSeason
}

export interface TeamSeason {
    matches:Match[]
}