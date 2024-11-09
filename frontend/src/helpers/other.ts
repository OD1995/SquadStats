import { Club } from "../types/Club";
import { Team } from "../types/Team";
import { User } from "../types/User";


export const getTeam = (user:User|null, teamId:string|undefined) : Team|null => {
    if (user == null) {
        return null;
    }
    for (const club of user.clubs) {
        for (const team of club.teams) {
            if (team.team_id == teamId) {
                return team;
            }
        }
    }
    return null;
}


export const getClub = (user:User|null, clubId:string|undefined) : Club|null => {
    if (user == null) {
        return null;
    }
    for (const club of user.clubs) {
        if (club.club_id == clubId) {
            return club
        }
    }
    return null;
}