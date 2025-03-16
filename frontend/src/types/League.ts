import { LeagueSeason } from "./Season"

export interface League {
    league_id:string
    league_name:string
    league_seasons:Record<string, LeagueSeason>
}