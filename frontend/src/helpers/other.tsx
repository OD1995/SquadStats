import { TableCell, TableRow } from "@mui/material";
import { Club } from "../types/Club";
import { Team } from "../types/Team";
import { User } from "../types/User";
import { TableCellValue } from "../types/TableCellValue";


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

export function toEntries<T>(a: T[]) {
    return a.map((value, index) => [index, value] as const);
}

export const generateHeaderRow = (cols:string[]) => {
    return (
        <TableRow className="ss-table-head">
            {cols.map((col:string) => <TableCell className="ss-table-cell">{col}</TableCell>)}
        </TableRow>
    )
}

export const generateBodyRow = (values:TableCellValue[]) => {
    return (
        <TableRow>
            {
                values.map(
                    (val:TableCellValue) => {
                        return (
                            <TableCell className={"ss-table-cell " + val.className}>
                                {val.value}
                            </TableCell>
                        )
                    }
                )
            }
        </TableRow>
    )
}

export const getTeamOverviewHeaders = (columnHeaders:string[]) => {    
    return [""].concat(columnHeaders).map(
        (header:string) => {
            return <th>{header}</th>
        }
    )
}

export const getIsClubAdmin = (user:User|null, team:Team|null) => {
    if (user && team) {
        const clubId = team.club_id;
        for (const club of user.clubs) {
            if (club.club_id == clubId) {
                return true;
            }
        }
    }
    return false;
}