import { Season } from "./Season"

export interface League {
    league_id:string
    league_name:string
    league_seasons:Season[]
}