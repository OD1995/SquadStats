import { Team } from "./Team"

export interface Club {
    club_name: string
    club_id: string
    teams: Team[]
}